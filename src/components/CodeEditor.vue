<!--代码编辑器组件-->
<template>
  <div
    id="code-editor"
    ref="codeEditorRef"
    style="min-height: 400px; height: 60vh"
  />
  <!--  <a-button @click="fillValue">填充值</a-button>-->
</template>

<script lang="ts" setup>
import * as monaco from "monaco-editor";
import { defineProps, onMounted, ref, toRaw, watch, withDefaults } from "vue";

/**
 * 定义组件属性类型
 */
interface Props {
  value: string;
  language?: string;
  handleChange: (v: string) => void;
}

/**
 * 给组件指定初始值
 */
const props = withDefaults(defineProps<Props>(), {
  value: () => "",
  language: () => "java",
  handleChange: (v: string) => {
    console.log(v);
  },
});
// 设置不同语言的初始化代码
const languageCode = {
  java: `/*示例代码*/
public class Main {
     public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
  python: `# 示例代码
  print("Hello, World!")`,
};

const codeEditorRef = ref();
const codeEditor = ref();

// const fillValue = () => {
//   if (!codeEditor.value) {
//     return;
//   }
//   // 改变值
//   toRaw(codeEditor.value).setValue("新的值");
// };

watch(
  () => props.language,
  () => {
    if (codeEditor.value) {
      monaco.editor.setModelLanguage(
        toRaw(codeEditor.value).getModel(),
        props.language
      );
    }
  }
);

watch(
  () => props.language,
  () => {
    if (codeEditor.value) {
      // 设置不同语言的初始化代码
      toRaw(codeEditor.value).setValue(languageCode[props.language]);
    }
  }
);

onMounted(() => {
  if (!codeEditorRef.value) {
    return;
  }
  // Hover on each property to see its docs!
  codeEditor.value = monaco.editor.create(codeEditorRef.value, {
    value: languageCode[props.language],
    language: props.language,
    automaticLayout: true,
    colorDecorators: true,
    folding: true,
    renderLineHighlight: "all",
    foldingStrategy: "indentation",
    autoClosingBrackets: "always",
    autoClosingDelete: "always",
    autoClosingOvertype: "always",
    formatOnPaste: true,
    autoIndent: "none",
    cursorBlinking: "solid",
    minimap: {
      enabled: true,
    },
    readOnly: false,
    theme: "vs-dark",
    // fontSize: 14,
    lineNumbers: "on",
    // roundedSelection: false,
    // scrollBeyondLastLine: false,
  });

  // 编辑 监听内容变化
  codeEditor.value.onDidChangeModelContent(() => {
    props.handleChange(toRaw(codeEditor.value).getValue());
  });
});
</script>

<style scoped></style>
