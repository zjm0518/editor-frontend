import { createGlobalState, useDark } from "@vueuse/core";

export const generateHTML = (
  payload: Record<string, any>,
  isDark?: boolean
) => {
  return `<html class="${isDark ? "dark" : ""}">
        <head>
            <style id="_style">${payload.css}</style>
            <script type="module" id="_script">
                ${payload.javascript}

                window.addEventListener('message', function(event) {
                    console.log(event)
                    if (event.data === 'theme-dark') {
                        document.documentElement.classList.add('dark')
                    } else if (event.data === 'theme-light') {
                        document.documentElement.classList.remove('dark')
                    }
                })
            </\script>
        </head>
        <body>
            ${payload.html}
        </body>
    </html`;
};

export const useDarkGlobal = createGlobalState(() => useDark());

export const initialEditorValue = {
  html: '<div id="app" class="min-h-screen bg-gray-300 dark:bg-gray-600 py-6 flex flex-col sm:py-12 space-y-4">\n    <div v-for="(post, index) in posts" :key="index" class="max-w-2xl px-8 py-4 mx-auto bg-white rounded-lg shadow-md dark:bg-gray-800">\n        <div class="flex items-center justify-between">\n            <span class="text-sm font-light text-gray-600 dark:text-gray-400">Mar 10, 2019</span>\n            <a class="px-3 py-1 text-sm font-bold text-gray-100 transition-colors duration-200 transform bg-gray-600 rounded cursor-pointer hover:bg-gray-500">Design</a>\n        </div>\n\n        <div class="mt-2">\n            <a href="#" class="text-2xl font-bold text-gray-700 dark:text-white hover:text-gray-600 dark:hover:text-gray-200 hover:underline text-capitalize" v-text="post.title"></a>\n            <p class="mt-2 text-gray-600 dark:text-gray-300" v-text="post.body"></p>\n        </div>\n        \n        <div class="flex items-center justify-between mt-4">\n            <a href="#" class="text-blue-600 dark:text-blue-400 hover:underline">Read more</a>\n\n            <div class="flex items-center">\n                <img class="hidden object-cover w-10 h-10 mx-4 rounded-full sm:block" :src="post.avatar" alt="avatar">\n                <a class="font-bold text-gray-700 cursor-pointer dark:text-gray-200" v-text="post.name"></a>\n            </div>\n        </div>\n    </div>\n</div>',
  javascript:
    "import { setup as twindSetup } from 'https://cdn.skypack.dev/twind/shim'\nimport { \n    createApp, \n    ref \n} from 'https://esm.sh/vue@3.2.37/dist/vue.esm-browser.js'\nimport { faker } from 'https://cdn.skypack.dev/@faker-js/faker'\n  \n\ntwindSetup({\n    darkMode: 'class'\n})\n\nconst generateFakePosts = (count) => {\n    return [...Array(count).keys()].map(() => ({\n        name: faker.name.fullName(),\n        avatar: faker.image.avatar(),\n        cover: faker.image.image().replace('http', 'https'),\n        title: faker.lorem.words(5),\n        body: faker.lorem.sentences(5)\n    }))\n}\n\ncreateApp({\n  data() {\n    return {\n      posts: generateFakePosts(10)\n    }\n  }\n}).mount('#app')",
  css: "",
};

export function getFileLanguage(fileName: string) {
  const arr = fileName.split(".");
  const type = (arr.pop() || "").toLowerCase();
  switch (type) {
    case "jks":
      return "python";
      case "bat":
        return "bat"
    case "vue":
      return "vue";
    case "js":
      return "javascript";
    case "go":
      return "go";
    case "ts":
      return "typescript";
    case "xml":
      return "xml";
    case "c":
      return "c";
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
      return "python";
    case "git":
    case "gitignore":
      return "git";
    case "less":
      return "less";
    case "scss":
    case "sass":
      return "sass";
    case "css":
      return "iconfont vs-css icon-b";
    case "md":
      if (fileName.toLowerCase() === "readme.md") {
        return "iconfont vs-readme icon-b";
      }
      return "iconfont vs-md icon-b";
    case "json":
      return "json";
    case "html":
      return "html";
    case "yml":
    case "yaml":
      return "yanl";
    case "cs":
      return "iconfont vs-c3 icon-b";
    case "cpp":
      return "cpp";
    case "cjs":
      return "iconfont vs-cjs icon-cyan";
    default:
      return "iconfont vs-default icon-w";
  }
}
