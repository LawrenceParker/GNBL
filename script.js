const SHEET_ID = "1HVoEKPbWYC3CjbWPPsLIK3EcoW55YX3wh7dRs_vYoms";
const SHEET_NAME = "Sheet11";

const URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=${SHEET_NAME}&tqx=out:json`;

function format(value) {
    const num = Number(value);
    if (isNaN(num)) return value || "";
    return num.toFixed(2);
}

function extractJSON(text) {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    return JSON.parse(text.slice(start, end + 1));
}

// 🔥 Map column names → index automatically
function getColumnMap(cols) {
    const map = {};
    cols.forEach((col, i) => {
        if (col.label) map[col.label] = i;
    });
    return map;
}

async function loadLeaderboard() {
    try {
        const res = await fetch(URL);
        const text = await res.text();

        const json = extractJSON(text);

        const cols = json.table.cols;
        const rows = json.table.rows;

        const map = getColumnMap(cols);

        const tbody = document.getElementById("leaderboard-body");
        tbody.innerHTML = "";

        let rank = 0;

        rows.forEach(row => {
            const c = row.c || [];

            const player = c[map.Player]?.v;

            if (!player || player === "Player") return;

            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>${++rank}</td>
                <td>${player}</td>
                <td>${format(c[map.RTG]?.v)}</td>
                <td>${format(c[map.KDA]?.v)}</td>
                <td>${format(c[map.KILLS]?.v)}</td>
                <td>${format(c[map.DEATHS]?.v)}</td>
                <td>${format(c[map.ASSISTS]?.v)}</td>
                <td>${format(c[map.NTK]?.v)}</td>
                <td>${format(c[map.STREAK]?.v)}</td>
                <td>${format(c[map.DMG]?.v)}</td>
                <td>${format(c[map.FB]?.v)}</td>
                <td>${format(c[map.FD]?.v)}</td>
                <td>${format(c[map["FB/FD"]]?.v)}</td>
                <td>${c[map.Team]?.v || ""}</td>
            `;

            tbody.appendChild(tr);
        });

    } catch (err) {
        console.error("Leaderboard error:", err);
    }
}

// start
loadLeaderboard();
setInterval(loadLeaderboard, 15000);