// Fungsi untuk menukar semua (nama tim, gambar tim, dan status checkbox 1-3 dengan 4-6)
document.getElementById('switch-team').addEventListener('click', function() {
    // Tukar nama tim
    const team1 = document.getElementById('team-1');
    const team2 = document.getElementById('team-2');
    [team1.value, team2.value] = [team2.value, team1.value];
    UpdateTeamName();
    
    // Tukar gambar utama
    const img1 = document.getElementById('logo-1');
    const img2 = document.getElementById('logo-2');
    [img1.src, img2.src] = [img2.src, img1.src];
    
    // Tukar status checkbox dan visibilitas gambar tambahan
    for (let i = 1; i <= 3; i++) {
        const checkbox1 = document.getElementById(`win-check-${i}`);
        const checkbox2 = document.getElementById(`win-check-${i + 3}`);
        const winIcon1 = document.getElementById(`win-icon-${i}`);
        const winIcon2 = document.getElementById(`win-icon-${i + 3}`);
        
        // Tukar status checkbox
        [checkbox1.checked, checkbox2.checked] = [checkbox2.checked, checkbox1.checked];
        
        // Tukar tampilan gambar berdasarkan checkbox
        winIcon1.style.display = checkbox1.checked ? "block" : "none";
        winIcon2.style.display = checkbox2.checked ? "block" : "none";
    }
});

// Fungsi untuk mereset logo, nama tim, nama pemain, dan checkbox ke kondisi awal
document.getElementById('reset-team').addEventListener('click', function(){
    //reset nama team
    document.getElementById('team-1').value = "Team 1";
    document.getElementById('team-2').value = "Team 2";
    UpdateTeamName();
    
    // reset logo
    document.getElementById('logo-1').src = "Assets/Other/80x80.png";
    document.getElementById('logo-2').src = "Assets/Other/80x80.png";
    
    document.getElementById('file-logo-1').value = "";
    document.getElementById('file-logo-2').value = "";
    
    // Reset checkbox dan gambar tambahan
    for (let i = 1; i <= 6; i++) {
        document.getElementById(`win-check-${i}`).checked = false;
        document.getElementById(`win-icon-${i}`).style.display = "none";
    }
});

// Fungsi untuk menampilkan atau menyembunyikan gambar berdasarkan checkbox
const checkboxes = document.querySelectorAll('.win-check')
checkboxes.forEach(checkbox => {
    checkbox.addEventListener('click', function(){
        const image = document.getElementById(`win-icon-${checkbox.id.replace('win-check-','')}`);
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

// Fungsi untuk memuat logo tim dari file lokal
document.querySelectorAll('.file-logo').forEach(input => {
    input.addEventListener('change', function(event) {
        const imgId = input.id.replace('file-logo-', 'logo-');
        const img = document.getElementById(imgId);
        img.src = URL.createObjectURL(event.target.files[0]);
    });
});

// Fungsi stopwatch
const display = document.getElementById("timestamp");
let timer = null;
let startTime = 0;
let elapsedTime = 0;
let isRunning = false;

//start button
document.getElementById('start-btn').addEventListener('click',function(){
    if(!isRunning){
        startTime = Date.now() - elapsedTime;
        timer = setInterval(update, 1000);
        isRunning = true;
    }
});

//stop button
document.getElementById('stop-btn').addEventListener('click',function(){
    if(isRunning){
        clearInterval(timer);
        elapsedTime = Date.now() - startTime;
        isRunning = false;
    }
});

//reset button
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
        document.querySelector('.gold-poin-1').innerText = blueTeam[1];  // Kolom B
        document.querySelector('.kill-poin-1').innerText = blueTeam[2];  // Kolom C
        document.querySelector('.turet-poin-1').innerText = blueTeam[3]; // Kolom D
        document.querySelector('.turtle-poin-1').innerText = blueTeam[4];// Kolom E
        document.querySelector('.lord-poin-1').innerText = blueTeam[5];  // Kolom F

        document.querySelector('.gold-poin-2').innerText = redTeam[1];
        document.querySelector('.kill-poin-2').innerText = redTeam[2];
        document.querySelector('.turet-poin-2').innerText = redTeam[3];
        document.querySelector('.turtle-poin-2').innerText = redTeam[4];
        document.querySelector('.lord-poin-2').innerText = redTeam[5];

    } catch (error) {
        console.error("Error fetching the Excel file:", error);
    }
}

// Auto-update every 1 seconds (1000 milliseconds)
setInterval(fetchExcelData, 1000);



