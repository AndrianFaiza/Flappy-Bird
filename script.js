// Kecepatan gerakan pipa dan gravitasi jatuh burung
let move_speed = 5, grativy = 0.6;

// Elemen burung 
let bird = document.querySelector('.bird');

// Mengambil elemen gambar burung (img) berdasarkan ID
let img = document.getElementById('bird-1');

// Efek suara untuk skor dan mati
let sound_point = new Audio('sounds effect/point.mp3');
let sound_die = new Audio('sounds effect/die.mp3');
let sound_jump = new Audio('sounds effect/jump.mp3');
let sound_start = new Audio('sounds effect/start.mp3');
//current
let currentCharacter = 1;

// Properti posisi dan ukuran burung
let bird_props = bird.getBoundingClientRect(); 
// getBoundingClientRect() mengembalikan nilai posisi dan ukuran elemen (top, left, width, height, dll)

// Ukuran dan posisi elemen latar belakang
let background = document.querySelector('.background').getBoundingClientRect();

console.log("Game Made by AndrianFaiza")

// Elemen nilai skor, pesan, dan judul skor dari DOM
let score_val = document.querySelector('.score_val');
let message = document.querySelector('.message');
let score_title = document.querySelector('.score_title');

// Lobby
let game_state = 'Start';
let start = document.getElementById('start')
let exit = document.getElementById('exit')

// Sembunyikan gambar burung, dan beri gaya pada pesan awal
img.style.display = 'none';
message.classList.add('messageStyle');
start.classList.add('start')
exit.classList.add('exit')

//Switch
document.getElementById("switch").addEventListener("click", () => {
  if (currentCharacter === 1) {
    currentCharacter = 2;
    document.getElementById("bird-1").style.display = "none";
    document.getElementById("chuck").style.display = "block";
  } else {
    currentCharacter = 1;
    document.getElementById("bird-1").style.display = "block";
    document.getElementById("chuck").style.display = "none";
  }
});

// Tombol Start
start.addEventListener('click', (e) => {
    // Jika tombol yang ditekan adalah "Enter" dan game belum dimulai
    if(start && game_state != 'Play'){
        // Hapus semua pipa yang ada di layar
        document.querySelectorAll('.pipe_sprite').forEach((e) => {
            e.remove();
        });

        // Tampilkan burung dan reset posisi serta skor
        img.style.display = 'block';
        bird.style.top = '0vh';
        game_state = 'Play';
        message.innerHTML = '';
        score_title.innerHTML = 'Score : ';
        score_val.innerHTML = '0';
        message.classList.remove('messageStyle');
        start.classList.remove('start')
        exit.classList.remove('exit');
        sound_start.play()
        
        play();
    }
});

// Tombol keluar
exit.addEventListener('click', (e) => {
    window.close()
})

// Fungsi utama untuk memulai permainan
function play(){
    // Menggerakkan pipa ke kiri
    function move(){
        if(game_state != 'Play') return;

        let pipe_sprite = document.querySelectorAll('.pipe_sprite');
        pipe_sprite.forEach((element) => {
            let pipe_sprite_props = element.getBoundingClientRect();
            bird_props = bird.getBoundingClientRect();

            // Jika pipa keluar dari layar kiri, hapus
            if(pipe_sprite_props.right <= 0){
                element.remove();
            } else {
                // Deteksi tabrakan antara burung dan pipa
                if(
                    bird_props.left < pipe_sprite_props.left + pipe_sprite_props.width &&
                    bird_props.left + bird_props.width > pipe_sprite_props.left &&
                    bird_props.top < pipe_sprite_props.top + pipe_sprite_props.height &&
                    bird_props.top + bird_props.height > pipe_sprite_props.top
                ){
                    // Jika tabrakan terjadi, akhiri permainan
                    game_state = 'End';
                    message.innerHTML = 'Game Over'.fontcolor('red') + '<br>Press Home To Back';
                    message.classList.add('messageStyle');
                    start.innerHTML = 'Home'
                    start.classList.add('start');
                    exit.innerHTML = 'Exit'
                    exit.classList.add('exit');
                    img.style.display = 'none';
                    sound_die.play();
                    return;
                } else {
                    // Menambah skor
                    if(pipe_sprite_props.right < bird_props.left &&
                        pipe_sprite_props.right + move_speed >= bird_props.left &&
                        element.increase_score == '1'){
                        score_val.innerHTML =+ score_val.innerHTML + 1;
                        sound_point.play();
                    }
                    // Gerakkan pipa ke kiri
                    element.style.left = pipe_sprite_props.left - move_speed + 'px';
                }
            }
        });

        // Panggil kembali fungsi ini untuk frame berikutnya
        requestAnimationFrame(move);
    }

    requestAnimationFrame(move);

    // Variabel kecepatan jatuh burung
    let bird_dy = 0;

    // Fungsi untuk menerapkan gravitasi
    function apply_gravity(){
        if(game_state != 'Play') return;

        // Tambahkan gravitasi ke kecepatan jatuh burung
        bird_dy = bird_dy + grativy;

        // Jika tombol panah atas atau spasi ditekan, burung "melompat"
        document.addEventListener('keydown', (e) => {
            if(e.key == 'ArrowUp' || e.key == ' '){
                img.src = 'images/Bird-2.png'; // Ganti gambar saat terbang
                bird_dy = -7.6; // Kecepatan lompat ke atas
                sound_jump.play();
            }
        });

        // Ganti gambar kembali setelah tombol dilepas
        document.addEventListener('keyup', (e) => {
            if(e.key == 'ArrowUp' || e.key == ' '){
                img.src = 'images/Bird.png';
                sound_jump.play
            }
        });

        // Cek jika burung keluar layar atas/bawah
         if(bird_props.top <= 0 || bird_props.bottom >= background.bottom){
             game_state = 'End';
             message.style.left = '28vw';
             window.location.reload(); // Reload halaman untuk restart
             message.classList.remove('messageStyle');
             start.classList.remove('stary');
             exit.classList.remove('exit');
             return;
         }
        // Update posisi burung berdasarkan kecepatan
        bird.style.top = bird_props.top + bird_dy + 'px';
        bird_props = bird.getBoundingClientRect();

        // Panggil kembali fungsi ini di frame berikutnya
        requestAnimationFrame(apply_gravity);
    }

    requestAnimationFrame(apply_gravity);

    // Variabel untuk mengatur jarak antar pipa
    let pipe_seperation = 116;

    // Jarak antara bagian atas dan bawah pipa
    let pipe_gap = 35;

    // Fungsi untuk membuat pipa baru
    function create_pipe(){
        if(game_state != 'Play') return;

        if(pipe_seperation > 115){
            pipe_seperation = 0;

            // Posisi acak pipa
            let pipe_posi = Math.floor(Math.random() * 43) + 8;

            // Pipa atas (terbalik)
            let pipe_sprite_inv = document.createElement('div');
            pipe_sprite_inv.className = 'pipe_sprite';
            pipe_sprite_inv.style.top = pipe_posi - 70 + 'vh';
            pipe_sprite_inv.style.left = '100vw'; // Mulai dari sisi kanan layar
            document.body.appendChild(pipe_sprite_inv);

            // Pipa bawah
            let pipe_sprite = document.createElement('div');
            pipe_sprite.className = 'pipe_sprite';
            pipe_sprite.style.top = pipe_posi + pipe_gap + 'vh';
            pipe_sprite.style.left = '100vw';
            pipe_sprite.increase_score = '1'; // Penanda untuk menambah skor
            document.body.appendChild(pipe_sprite);
        }

        // Tambah jarak antar pipa setiap frame
        pipe_seperation++;

        // Panggil kembali untuk frame berikutnya
        requestAnimationFrame(create_pipe);
    }

    requestAnimationFrame(create_pipe);
}
