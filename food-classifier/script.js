const MODEL_PATH = "./model/"; // model.json이 위치한 폴더 경로
let model, maxPredictions;

// 모델 초기화
async function initModel() {
    const modelURL = MODEL_PATH + "model.json";
    const metadataURL = MODEL_PATH + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
    console.log("모델이 성공적으로 로드되었습니다!");
}

// 이미지 업로드 이벤트
document.getElementById("upload").addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (file) {
        const image = document.createElement("img");
        image.src = URL.createObjectURL(file);
        image.onload = async () => {
            const prediction = await predictImage(image);
            showResult(prediction);
        };
    }
});

// 드래그 앤 드롭 이벤트
const dropZone = document.getElementById("drop-zone");
dropZone.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropZone.style.borderColor = "#90caf9";
});
dropZone.addEventListener("dragleave", () => {
    dropZone.style.borderColor = "#ccc";
});
dropZone.addEventListener("drop", (event) => {
    event.preventDefault();
    dropZone.style.borderColor = "#ccc";
    const file = event.dataTransfer.files[0];
    if (file) {
        const image = document.createElement("img");
        image.src = URL.createObjectURL(file);
        image.onload = async () => {
            const prediction = await predictImage(image);
            showResult(prediction);
        };
    }
});

// 예측 함수
async function predictImage(image) {
    const prediction = await model.predict(image, false);
    return prediction
        .sort((a, b) => b.probability - a.probability)
        .map((p) => `${p.className}: ${(p.probability * 100).toFixed(2)}%`);
}

// 결과 출력
function showResult(prediction) {
    const resultDiv = document.getElementById("result");
    resultDiv.style.display = "block";
    resultDiv.innerHTML = `
        <h3>분류 결과:</h3>
        <ul>
            ${prediction.map((p) => `<li>${p}</li>`).join("")}
        </ul>
    `;
}

// 초기화
initModel();
