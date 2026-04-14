function parseInput(input) {
    input = input.replace(/\s/g, "");

    // Nếu là dạng số
    if (/[0-9]/.test(input)) {
        return input.split(",").map(x => {
            if (x.length === 3) {
                let sum = x.split("").reduce((a, b) => a + Number(b), 0);
                return sum <= 10 ? "B" : "L";
            }
        }).filter(Boolean);
    }

    // Nếu là dạng L/B
    return input.split(",").join("").split("");
}

// Markov chain
function markov(data) {
    let trans = {
        "L": { "L": 0, "B": 0 },
        "B": { "L": 0, "B": 0 }
    };

    for (let i = 0; i < data.length - 1; i++) {
        trans[data[i]][data[i + 1]]++;
    }

    let prob = {
        "L": {},
        "B": {}
    };

    for (let key in trans) {
        let total = trans[key]["L"] + trans[key]["B"];
        prob[key]["L"] = trans[key]["L"] / total || 0;
        prob[key]["B"] = trans[key]["B"] / total || 0;
    }

    return prob;
}

// Nhận diện cầu
function detectPattern(data) {
    let last = data.slice(-5).join("");

    if (/LLLL|BBBB/.test(last)) return "Cầu bệt";
    if (/LBLB|BLBL/.test(last)) return "Cầu 1-1";
    return "Cầu loạn";
}

function analyze() {
    let raw = document.getElementById("input").value;
    let data = parseInput(raw);

    let countL = data.filter(x => x === "L").length;
    let countB = data.filter(x => x === "B").length;

    let total = data.length;

    let prob = markov(data);
    let last = data[data.length - 1];

    let nextL = prob[last]["L"];
    let nextB = prob[last]["B"];

    let pattern = detectPattern(data);

    let prediction = nextL > nextB ? "Lớn" : "Bé";
    let percent = Math.max(nextL, nextB) * 100;

    document.getElementById("result").innerHTML = `
        <p>Tổng: ${total}</p>
        <p class="lon">Lớn: ${countL} (${(countL/total*100).toFixed(1)}%)</p>
        <p class="be">Bé: ${countB} (${(countB/total*100).toFixed(1)}%)</p>

        <p>📊 Cầu hiện tại: <b>${pattern}</b></p>

        <p>📈 Xác suất từ trạng thái cuối (${last}):</p>
        <p>Lớn: ${(nextL*100).toFixed(1)}%</p>
        <p>Bé: ${(nextB*100).toFixed(1)}%</p>

        <h2>🔮 Dự đoán: ${prediction} (${percent.toFixed(1)}%)</h2>
    `;
}
