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
    input.addEventListener('change', function() {
        const imgId = input.id.replace('file-logo-', 'logo-');
        const img = document.getElementById(imgId);
        img.src = URL.createObjectURL(input.files[0]);
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
    try {
        // Mengambil data dari API Express yang dideploy di Vercel
        const response = await fetch('https://ingame-overlay.vercel.app/api/data');
        const data = await response.json();

        // Anggap data yang diterima memiliki struktur serupa dengan yang diinginkan
        const blueTeam = data[1];  // Data untuk tim biru (index 1)
        const redTeam = data[2];   // Data untuk tim merah (index 2)
        
        // Update HTML elements dengan data yang diterima
        document.querySelector('.gold-poin-1').innerText = blueTeam['Gold'] + 'K';  // Sesuaikan dengan key CSV
        document.querySelector('.kill-poin-1').innerText = blueTeam['Poin'];        // Sesuaikan dengan key CSV
        document.querySelector('.turet-poin-1').innerText = blueTeam['Turet'];       // Sesuaikan dengan key CSV
        document.querySelector('.turtle-poin-1').innerText = blueTeam['Turtle'];     // Sesuaikan dengan key CSV
        document.querySelector('.lord-poin-1').innerText = blueTeam['Lord'];         // Sesuaikan dengan key CSV

        document.querySelector('.gold-poin-2').innerText = redTeam['Gold'] + 'K';
        document.querySelector('.kill-poin-2').innerText = redTeam['Poin'];
        document.querySelector('.turet-poin-2').innerText = redTeam['Turet'];
        document.querySelector('.turtle-poin-2').innerText = redTeam['Turtle'];
        document.querySelector('.lord-poin-2').innerText = redTeam['Lord'];

    } catch (error) {
        console.error("Error fetching the data:", error);
    }
}

// Auto-update every 1 second (1000 milliseconds)
setInterval(fetchExcelData, 1000);




