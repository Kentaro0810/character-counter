const textInput = document.getElementById("textInput");
const characterCount = document.getElementById("characterCount");
const noSpaceCount = document.getElementById("noSpaceCount");
const lineCount = document.getElementById("lineCount");
const paragraphCount = document.getElementById("paragraphCount");
const manuscriptCount = document.getElementById("manuscriptCount");
const readingTime = document.getElementById("readingTime");
const copyButton = document.getElementById("copyButton");
const clearButton = document.getElementById("clearButton");
const actionMessage = document.getElementById("actionMessage");

const READING_SPEED_PER_MINUTE = 500;
const MANUSCRIPT_CHARACTERS = 400;
let messageTimer;

function countParagraphs(text) {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\n\s*\n+/).filter((paragraph) => paragraph.trim()).length;
}

function formatReadingTime(characterLength) {
  if (characterLength === 0) return "0秒";

  const totalSeconds = Math.max(1, Math.ceil((characterLength / READING_SPEED_PER_MINUTE) * 60));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes === 0) return `${seconds}秒`;
  if (seconds === 0) return `${minutes}分`;
  return `${minutes}分${seconds}秒`;
}

function getStats(text) {
  const characters = Array.from(text).length;
  const withoutSpaces = Array.from(text.replace(/\s/g, "")).length;
  const lines = text.length === 0 ? 0 : text.split(/\r\n|\r|\n/).length;
  const paragraphs = countParagraphs(text);
  const manuscriptPages = withoutSpaces === 0 ? 0 : withoutSpaces / MANUSCRIPT_CHARACTERS;

  return {
    characters,
    withoutSpaces,
    lines,
    paragraphs,
    manuscriptPages,
    reading: formatReadingTime(withoutSpaces)
  };
}

function updateStats() {
  const stats = getStats(textInput.value);
  characterCount.textContent = stats.characters.toLocaleString("ja-JP");
  noSpaceCount.textContent = stats.withoutSpaces.toLocaleString("ja-JP");
  lineCount.textContent = stats.lines.toLocaleString("ja-JP");
  paragraphCount.textContent = stats.paragraphs.toLocaleString("ja-JP");
  manuscriptCount.textContent = stats.manuscriptPages.toFixed(2);
  readingTime.textContent = stats.reading;
}

function showMessage(message, isError = false) {
  window.clearTimeout(messageTimer);
  actionMessage.textContent = message;
  actionMessage.style.color = isError ? "#dc2626" : "#15803d";
  messageTimer = window.setTimeout(() => {
    actionMessage.textContent = "";
  }, 2600);
}

async function copyResults() {
  const stats = getStats(textInput.value);
  const result = [
    "【文字数カウンターの結果】",
    `文字数：${stats.characters.toLocaleString("ja-JP")}文字`,
    `空白を除く：${stats.withoutSpaces.toLocaleString("ja-JP")}文字`,
    `行数：${stats.lines.toLocaleString("ja-JP")}行`,
    `段落数：${stats.paragraphs.toLocaleString("ja-JP")}段落`,
    `原稿用紙：約${stats.manuscriptPages.toFixed(2)}枚`,
    `読了時間：約${stats.reading}`
  ].join("\n");

  try {
    await navigator.clipboard.writeText(result);
    showMessage("分析結果をコピーしました。");
  } catch {
    showMessage("コピーできませんでした。ブラウザーの設定を確認してください。", true);
  }
}

function clearInput() {
  if (!textInput.value) {
    showMessage("消去する文章がありません。", true);
    return;
  }

  const shouldClear = window.confirm("入力した文章をすべて消去しますか？");
  if (!shouldClear) return;

  textInput.value = "";
  updateStats();
  textInput.focus();
  showMessage("入力内容を消去しました。");
}

textInput.addEventListener("input", updateStats);
copyButton.addEventListener("click", copyResults);
clearButton.addEventListener("click", clearInput);

updateStats();
