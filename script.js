// Fungsi untuk menampilkan atau menyembunyikan gambar berdasarkan checkbox
const checkboxes = document.querySelectorAll('.win-check')
checkboxes.forEach(checkbox => {
    checkbox.addEventListener('click', function(){
        const image = document.getElementById(`extraImage-${checkbox.id.replace('win-check-','')}`);
        image.style.display = checkbox.checked ? "block" : "none";
    })
});

// Fungsi untuk mengupdate nama tim yang ditampilkan
document.querySelectorAll('.teams').forEach(team => {
    team.addEventListener('input', UpdateTeamName);
});

function UpdateTeamName() {
    document.querySelectorAll('.teams').forEach(team => {
        const teamId = team.id.replace('team-', '');
        const teamName = team.value;
        document.getElementById(`team-name-display-${teamId}`).textContent = teamName;
    });
}

// Fungsi stopwatch
const display = document.getElementById("timestamp");
let timer = null;
let startTime = 0;
let elapsedTime = 0;
let isRunning = false;

//start
document.getElementById('start-btn').addEventListener('click',function(){
    if(!isRunning){
        startTime = Date.now() - elapsedTime;
        timer = setInterval(update, 1000);
        isRunning = true;
    }
});

//stop
document.getElementById('stop-btn').addEventListener('click',function(){
    if(isRunning){
        clearInterval(timer);
        elapsedTime = Date.now() - startTime;
        isRunning = false;
    }
});

document.getElementById('reset-btn').addEventListener('click',function reset(){
    clearInterval(timer);
    startTime = 0;
    elapsedTime = 0;
    isRunning = false;    
    display.textContent = "00:00";
});

function update(){
    
    const currentTime = Date.now();
    elapsedTime = currentTime - startTime;

    let minutes = Math.floor(elapsedTime / (1000 * 60) % 60);
    let seconds = Math.floor(elapsedTime / 1000 % 60);

    minutes = String(minutes).padStart(2, "0");
    seconds = String(seconds).padStart(2, "0");

    display.textContent = `${minutes}:${seconds}`;
};


async function fetchExcelData() {
    // Ubah link Google Sheets ke format CSV
    const googleSheetsCSVUrl = "https://docs.google.com/spreadsheets/d/1WPZ4gt1uy91khX6W4u1dG1sSdohj4mo1RCx0zoLatq4/export?format=csv&gid=0";

    try {
        // Fetch the CSV file
        const response = await fetch(googleSheetsCSVUrl);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const csvText = await response.text();

        // Convert CSV text to array using SheetJS
        const workbook = XLSX.read(csvText, { type: "string" });
        const sheetName = workbook.SheetNames[0];
        const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });

        const blueTeam = sheet[1]; // Baris ke-2 di Excel (index 1)
        const redTeam = sheet[2];  // Baris ke-3 di Excel (index 2)

        // Update HTML elements with Excel data
        document.querySelector('.gold-1').innerText = blueTeam[1];  // Kolom B
        document.querySelector('.poin-1').innerText = blueTeam[2];  // Kolom C
        document.querySelector('.turet-1').innerText = blueTeam[3]; // Kolom D
        document.querySelector('.turtle-1').innerText = blueTeam[4];// Kolom E
        document.querySelector('.lord-1').innerText = blueTeam[5];  // Kolom F

        document.querySelector('.gold-2').innerText = redTeam[1];
        document.querySelector('.poin-2').innerText = redTeam[2];
        document.querySelector('.turet-2').innerText = redTeam[3];
        document.querySelector('.turtle-2').innerText = redTeam[4];
        document.querySelector('.lord-2').innerText = redTeam[5];

    } catch (error) {
        console.error("Error fetching the Excel file:", error);
    }
}

// Auto-update every 10 seconds (10000 milliseconds)
setInterval(fetchExcelData, 1000);



