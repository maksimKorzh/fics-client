window.fics.connect();

const output = document.getElementById('output');
const input = document.getElementById('input');

window.fics.onData((data) => {
  output.textContent += data;
  output.scrollTop = output.scrollHeight;
});

input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const cmd = input.value;
        window.fics.sendCommand(cmd);
        input.value = '';
        let terminal = document.getElementById('output');
        terminal.scrollTop = terminal.scrollHeight;
    }
});