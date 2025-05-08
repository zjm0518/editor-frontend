import * as monaco from "monaco-editor";
const AuxFunc=[
  "load_module",
  "AuxFunc",
  "global",
  "usleep",
  "msleep_old",
  "msleep",
  "clockBegin",
  "getSecond",
  "getMilliSecond",
  "getMicroSecond",
  "copyToClipBoard",
  "getChar",
  "getLine",
  "writeLog",
  "appendFile",
  "readFile",
  "writeFile",
  "removeJsonComment",
  "getCurrentDate",
  "getCurrentTime_ms",
  "getCurrentTime_s",
  "shell",
  "setvbuf",
  "str2Value",



]
const endPosTrajSymbols = ["EndPosTraj", "plan", "blockPnt", "maxPnt", "traj", "curPnt", "running_index", "moveC", "moveCCircle_traj", "moveCCircle", "init", "check_fifo_empty", "append_track_point", "runCircleCurve", "movCTrans", "movCTrajFull", "movCTrajPart"];
const ConveyorTrack = [
  "calcPosParam",
  "calcVelParam",
  "setPosVelParam",
  "setFollowZoneToSwitch",
  "setRbtMovDir",
  "initZoneParam",
  "conveyorTrackFollow"
];
const ForceSensor = ["JkForceSensor", "openForceSensor", "closeForceSensor", "writeData", "readData", "setMode"];
const JKModbus = [
  "Tab", "bits", "input_bits", "reg", "input_reg",
  "JkModBusMaster", "ctx", "newTcp", "newRtu", "setMode", "setSlaver", "connect", "close",
  "readBits", "readInputBits", "readRegs", "readInputRegs", "writeBit", "writeBits", "writeReg", "writeRegs",
  "JkModBusSlave", "mb_mapping", "tab", "query", "listen", "tcpAccept", "closeClient", "reply", "receive", "setSlave"
];
const JKModule_shareMessage = [
  "CSMCommandMsg", "m_sh", "head", "tail", "print_msg",
  "initial", "new_msg", "clear_seq", "add_seq",
  "writeStrToSM", "readStrFromSM"
];
const JKSerialPort = [
  "JkSerialPort", "serial_port",
  "openSerialPort", "closeSerialPort",
  "writeData", "readData_str", "readData_vec",
  "CRC16", "char4toFloat",
  "portname", "baudrate", "parity", "databit", "stopbit",
  "buf", "len", "r_count", "char_val", "float_val"
];
const LSPB = [
  "Lspb", "traj","LSPB",
  "LSPB_ST", "GetPntOut_ST", "SetTempSliceIndex_ST", "GetTempSliceIndex_ST",
  "GetLastSliceLength_ST", "GetPlanSliceNum_ST", "GetPlanEndFlag_ST", "GetJntNum_ST",
  "ResetEndFlag_ST", "ResetTempSliceIndex_ST", "ResetPntArray_ST", "TestGetAllPntOut_ST",
  "LSPB_FT", "GetPntOut_FT", "SetTempSliceIndex_FT", "GetTempSliceIndex_FT",
  "GetLastSliceLength_FT", "GetPlanSliceNum_FT", "GetPlanEndFlag_FT", "GetJntNum_FT",
  "ResetEndFlag_FT", "ResetTempSliceIndex_FT", "ResetPntArray_FT", "TestGetAllPntOut_FT",
  "jnt_start", "jnt_mid", "jnt_end", "vel_desire", "acc_desire",
  "joint", "slice_num", "joint_array"
];
const LSPB_mov=["LspbMov", "jnt_start", "jnt_mid", "jnt_end",
  "vel_desire", "acc_desire", "block_pnt", "init_flag", "getdata_flag",
  "cur_index", "pntplan", "running_index", "jntVec1", "jntVec2", "jntVec", "unfilled_flag", "LspbMov", "InitMov",
  "PlanLSPB", "LspbMove", "CheckFifoEmpty", "AppendTrackPoint"];
const multiCurve=["PlotCurve", "vecPos", "vecR", "vecMark", "trajPosTime", "trajPosS",
  "trajPosA", "trajPosA_S", "PointsA_S", "vel", "acc", "dec", "FilterNum", "check_mark_flag",
  "PlotCurve", "getPlotCurve", "CalcDeltaAngle_Pos", "Check_Mark_Box", "ShowCurve",
  "MultiCurve", "vecRelPos", "vecRadius",
   "vecFilterMark", "MultiCurve", "clear", "appendVector", "miniAngle", "miniAngleAppendVector",
   "TransitionP", "TransitionFilterP", "check_fifo_empty", "check_empty", "MoveTrajP"];
const Robot5D=[
  "Robot5D", "Robot5D", "setup", "remoteSetup", "beginReadSymbol", "endReadSymbol", "clearReadSymbol", "printReadSymbol", "getReadSymbolAddr", "readSymbolData",
  "readSymbolData", "beginWriteSymbol", "endWriteSymbol", "clearWriteSymbol", "printWriteSymbol", "getWriteSymbol", "writeSymbolData", "writeSymbolData",
  "getVarDouble", "setVarDouble", "getArrayVarDouble", "setArrayVarDouble", "getVarFloat", "setVarFloat", "getArrayVarFloat", "setArrayVarFloat", "getVarInt",
  "setVarInt", "getArrayVarInt", "setArrayVarInt", "getVarUInt", "setVarUInt", "getArrayVarUInt", "setArrayVarUInt", "getVarInt16", "setVarInt16", "getArrayVarInt16",
  "setArrayVarInt16", "getVarUInt16", "setVarUInt16", "getArrayVarUInt16", "setArrayVarUInt16", "getVarInt8", "setVarInt8", "getArrayVarInt8", "setArrayVarInt8",
  "getVarUInt8", "setVarUInt8", "getArrayVarUInt8", "setArrayVarUInt8", "pause", "resume", "setSafetyIndex", "setCollisionMode", "setCollisionTime", "clearCollision",
  "getCollisionMode", "getCollisionTime", "setRobotStatus", "getRobotStatus", "getRobotError", "setIOInit", "setEnable", "setMotionMode", "setRelMovAndFrameFlag",
  "movAbsJoint", "movAbsBase", "movRelBase", "movPos", "setMovMode", "setAccDecAccuracy", "setSecondAccDecAccuracy", "setOcpmAccDecAccuracy"
]
const Robot6D=["Robot6D", "Robot6D", "setup", "remoteSetup", "beginReadSymbol", "endReadSymbol", "clearReadSymbol", "printReadSymbol", "getReadSymbolAddr", "readSymbolData", "readSymbolData", "readAndEndReadSymbol", "beginWriteSymbol", "endWriteSymbol", "clearWriteSymbol", "printWriteSymbol", "getWriteSymbol", "writeSymbolData", "writeSymbolData", "writeAndEndWriteSymbol", "getVarDouble", "setVarDouble", "getArrayVarDouble", "setArrayVarDouble", "getVarFloat", "setVarFloat", "getArrayVarFloat", "setArrayVarFloat", "getVarInt", "setVarInt", "getArrayVarInt", "setArrayVarInt", "getVarUInt", "setVarUInt", "getArrayVarUInt", "setArrayVarUInt", "getVarInt16", "setVarInt16", "getArrayVarInt16", "setArrayVarInt16", "getVarUInt16", "setVarUInt16", "getArrayVarUInt16", "setArrayVarUInt16", "getVarInt8", "setVarInt8", "getArrayVarInt8", "setArrayVarInt8", "getVarUInt8", "setVarUInt8", "getArrayVarUInt8", "setArrayVarUInt8", "pause", "resume", "setSafetyIndex", "setCollisionMode", "setCollisionTime", "clearCollision", "getCollisionMode", "getCollisionTime", "setRobotStatus", "getRobotStatus", "getRobotError", "setIOInit", "setEnable", "setMotionMode", "setRelMovAndFrameFlag", "movAbsJoint", "movAbsBase", "movPos", "movRelBase", "setMovMode", "setAccDecAccuracy", "setSecondAccDecAccuracy"]
const Robot7D = [
  "Robot7D", "Robot7D", "setup", "remoteSetup", "beginReadSymbol", "endReadSymbol",
  "clearReadSymbol", "printReadSymbol", "getReadSymbolAddr", "readSymbolData",
  "readSymbolData", "beginWriteSymbol", "endWriteSymbol", "clearWriteSymbol",
  "printWriteSymbol", "getWriteSymbol", "writeSymbolData", "writeSymbolData",
  "getVarDouble", "setVarDouble", "getArrayVarDouble", "setArrayVarDouble",
  "getVarFloat", "setVarFloat", "getArrayVarFloat", "setArrayVarFloat", "getVarInt",
  "setVarInt", "getArrayVarInt", "setArrayVarInt", "getVarUInt", "setVarUInt",
  "getArrayVarUInt", "setArrayVarUInt", "getVarInt16", "setVarInt16", "getArrayVarInt16",
  "setArrayVarInt16", "getVarUInt16", "setVarUInt16", "getArrayVarUInt16",
  "setArrayVarUInt16", "getVarInt8", "setVarInt8", "getArrayVarInt8", "setArrayVarInt8",
  "getVarUInt8", "setVarUInt8", "getArrayVarUInt8", "setArrayVarUInt8", "pause",
  "resume", "setSafetyIndex", "setCollisionMode", "setCollisionTime", "clearCollision",
  "getCollisionMode", "getCollisionTime", "setRobotStatus", "getRobotStatus", "getRobotError",
  "setIOInit", "setEnable", "setMotionMode", "setRelMovAndFrameFlag", "movAbsJoint",
  "movAbsBase", "movPos", "movRelBase", "setMovMode", "setAccDecAccuracy",
  "setSecondAccDecAccuracy", "setOcpmAccDecAccuracy"
];
const RobotHand=["load_module", "use", "InspireHand", "InspireHand", "createRobotHand", "handInit", "handClearError", "saveParam", "setFingerAngle", "setFingerSpeed", "setFingerForce", "getHandState", "setWristAngle", "getWristInform", "InspireHand_twoFinger", "InspireHand_twoFinger", "connect", "initial", "setMotionMode", "stop", "cancel_stop", "resume", "pause", "clean_err", "setPosLimit", "getPosLimit", "setTargetPos", "getTargetPos", "getRealPos", "setTargetVel", "getTargetVel", "setTargetTor", "getTargetTor", "getRealTor", "getStateCode", "getErrorCode"]
const SafeModule=["sys_printToolCoord", "sys_disVector", "sys_recordInfoLog", "sys_movAbsJointSafe", "sys_movAbsJoint_noneblock", "sys_movAbsBaseSafe", "sys_movAbsBase_noneblock", "sys_movRealEndSafe"]
const Vector = [
  "RotX", "RotY", "RotZ", "MatMulMat", "Rotation_0_e",
  "ToolCoordRotationZYX", "RotationZYX", "MinusVector3",
  "AddVector3", "ScalarMulVec3", "CrossProduct3",
  "InnerProduct3", "NormalizeVector3", "NormVector3",
  "MidPointVector3", "MatMulVec", "TransposeMatrix3x3",
  "SphereCenter", "Link3Vector", "Calc_ePt", "Calc_eRt"
];
const unittest=["assert_equal","assert_false","assert_true","assert_not_equal","assert_throws"]
const packages=["AuxFunc","ConveyorTrack","ForceSensor","JKModbus","JKModule_shareMessage","JKSerialPort","LSPB","LSPB_mov","multiCurve","Robot5D","Robot6D","Robot7D","RobotHand","SafeModule","Vector","RobotBase"]
export const completion=(model, position)=>  {
  const word = model.getWordUntilPosition(position);
  const range = {
    startLineNumber: position.lineNumber,
    endLineNumber: position.lineNumber,
    startColumn: word.startColumn,
    endColumn: word.endColumn,
  };

  const funcNames=[packages,AuxFunc,endPosTrajSymbols,ConveyorTrack,ForceSensor,JKModbus,JKModule_shareMessage,JKSerialPort,LSPB,LSPB_mov,multiCurve,Robot5D,Robot6D,Robot7D,RobotHand,SafeModule,Vector,unittest]
  const uniqueItems = [...new Set(funcNames.flat())];

  const completionItems = uniqueItems.map(text => ({
    label: text,
    kind: monaco.languages.CompletionItemKind.Text,
    insertText: text,
    range: range,
  }));
  const suggestions = [
    ...completionItems,
    {
      label: "ifelse",
      kind: monaco.languages.CompletionItemKind.Snippet,
      insertText: [
        "if (${1:condition}) {",
        "\t$0",
        "} else {",
        "\t",
        "}",
      ].join("\n"),
      insertTextRules:
        monaco.languages.CompletionItemInsertTextRule
          .InsertAsSnippet,
      documentation: "If-Else Statement",
      range: range,
    },
  ];
  const codeText = model.getValue();
  const regex = /\b\w+\b/g;  // \b 表示单词边界，\w 匹配字母、数字和下划线
  const allWords = [];
  let match;
  while ((match = regex.exec(codeText)) !== null) {
    allWords.push(match[0]);
  }
  // 获取当前光标下的词汇
  const wordUnderCursor = word.word;
   // 将当前文件中出现过的词汇作为补全项
   allWords.forEach(w => {
    if (w !== wordUnderCursor) {
      suggestions.push({
        label: w,
        kind: monaco.languages.CompletionItemKind.Text,
        insertText: w,
        range: range
      });
    }
  });


  return { suggestions: suggestions };
}
