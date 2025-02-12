export function fileSorts(files: Array<FileData>) {
  files.sort((a: FileData, b: FileData) => {
    if (a.isDir && b.isDir) {
      // 都是目录
      return a.name < b.name ? -1 : 0;
    } else if (a.isDir || b.isDir) {
      return a.isDir ? -1 : 0;
    } else {
      return a.name < b.name ? -1 : 0;
    }
  });
  files.forEach((file) => {
    if (file.isDir && file.children) {
      fileSorts(file.children);
    }
  });
}

function isFolder(filePath) {
  if (filePath.endsWith("/")) {
    return true;
  } else {
    return false;
  }
}

declare interface FileData {
  name: string;
  path: string;
  isDir: boolean;
  children?: Array<FileData>;
}

import { v4 as uuidv4 } from "uuid";

export function dealFilePath(filePaths: Array<string>) {
  const fileArr: Array<FileData> = [];
  filePaths.forEach((path) => {
    const isDir = isFolder(path);
    let isExist = true;
    const paths = path.split("/").filter((item) => item.trim());
    let start = 0;
    let tempArr = fileArr;
    while (start < paths.length) {
      const index = tempArr.findIndex((item) => item.name === paths[start]);
      if (start === paths.length - 1) {
        if (index < 0 || tempArr[index].isDir !== isDir) {
          if (isDir) {
            tempArr.push({
              name: paths[start],
              key: uuidv4(),
              path: path,
              isDir: isDir,
              children: [],
            });
          } else {
            tempArr.push({
              name: paths[start],
              key: uuidv4(),
              path: path,
              isDir: isDir,
            });
          }
        }
      } else {
        if (!isExist || index < 0 || !tempArr[index].isDir) {
          tempArr.push({
            name: paths[start],
            key: uuidv4(),
            path: paths.slice(0, start + 1).join("/"),
            isDir: true,
            children: [],
          });
          isExist = false;
          tempArr = tempArr[tempArr.length - 1].children;
        } else {
          tempArr = tempArr[index].children;
        }
      }
      start++;
    }
  });
  return fileArr;
}

export function getFileIcon(fileName: string) {
  if (fileName.toLowerCase().startsWith("changelog")) {
    return "iconfont vs-log";
  }
  const arr = fileName.split(".");
  const type = (arr.pop() || "").toLowerCase();
  switch (type) {
    case "vue":
      return "iconfont vs-vue icon-g";
    case "js":
      return "iconfont vs-js icon-y";
    case "go":
      return "iconfont vs-go icon-b";
    case "ts":
      return "iconfont vs-ts icon-b";
    case "tpl":
      return "iconfont vs-tpl icon-y";
    case "xml":
      return "iconfont vs-xml icon-r";
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
      return "iconfont vs-image icon-purple";
    case "c":
      return "iconfont vs-c icon-b";
    case "jsx":
      return "iconfont vs-react icon-b";
    case "license":
      return "iconfont vs-license icon-y";
    case "setting":
      return "iconfont vs-setting";
    case "log":
      return "iconfont vs-log";
    case "java":
    case "jar":
      return "iconfont vs-java icon-b";
    case "py":
      return "iconfont vs-python icon-b";
    case "git":
    case "gitignore":
      return "iconfont vs-git";
    case "less":
      return "iconfont vs-less icon-purple";
    case "scss":
    case "sass":
      return "iconfont vs-scss icon-wine-red";
    case "css":
      return "iconfont vs-css icon-b";
    case "md":
      if (fileName.toLowerCase() === "readme.md") {
        return "iconfont vs-readme icon-b";
      }
      return "iconfont vs-md icon-b";
    case "json":
      if (fileName === "tsconfig.json") {
        return "iconfont vs-tsconfig icon-b";
      }
      return "iconfont vs-json icon-y";
    case "html":
      return "iconfont vs-html icon-pink";
    case "yml":
    case "yaml":
      return "iconfont vs-yaml icon-purple";
    case "cs":
      return "iconfont vs-c3 icon-b";
    case "cpp":
      return "iconfont vs-c2 icon-b";
    case "svg":
      return "iconfont vs-svg icon-purple";
    case "npmrc":
      return "iconfont vs-npm icon-r";
    case "cjs":
      return "iconfont vs-cjs icon-cyan";
    default:
      return "iconfont vs-default icon-w";
  }
}
interface TreeNode {
  label: string;
  children?: TreeNode[];
  path?: string;
  isDir?: boolean;
  key?: string;
  isNew?: boolean;
}

// 转换目录结构为树形数据
export function convertToTreeData(data: any) {
  return data.map((item: any) => {
    const path = item.path.replace(/\\$/, ""); // 去掉末尾的 \\
    const treeNode: TreeNode = {
      label: path.split("\\").pop() || "", // 仅取文件或目录的名称作为 label
      path: item.path,
      key: uuidv4(),
    };

    if (item.is_directory && item.children && item.children.length > 0) {
      treeNode.children = convertToTreeData(item.children); // 递归处理子目录
    } else if (item.is_directory) {
      //空目录
      treeNode.children = [];
    }
    treeNode.isDir = item.is_directory;
    treeNode.isNew = false;
    //treeNode.isLeaf=item.is_directory?"leaf":""
    return treeNode;
  });
}
export function sortDirTree(data: any) {
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    // 先对当前节点的children排序，把isDir为true的项排到前面
    if (node.children && Array.isArray(node.children)) {
      node.children.sort((a, b) => {
        // 首先按照isDir为true的项排在前面
        if (a.is_directory && !b.is_directory) return -1;
        if (!a.is_directory && b.is_directory) return 1;
        return 0; // 如果isDir一样，就不排序
      });

      // 对每个子元素递归调用排序

        sortDirTree(node.children);

    }
  }
}
export default {
  fileSorts,
  dealFilePath,
  getFileIcon,
};
