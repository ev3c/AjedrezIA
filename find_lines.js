const fs = require('fs');
const code = fs.readFileSync('./app.js', 'utf8');
const lines = code.split('\n');
const failed = ['mcconnell-morphy','alekhine-bogoljubov','fischer-larsen-71','fischer-petrosian-71','tal-botvinnik-60','fischer-11-0','kasparov-shirov-94','capablanca-alekhine-27','tal-hecht-62','korchnoi-karpov-78','kasparov-portisch-83','tal-tringov-64','tal-flesch-81','karpov-spassky-74','karpov-kasparov-87','kasparov-kramnik-96','anand-karpov-98','anand-topalov-05','alekhine-nimzowitsch','alekhine-lasker-14','steinitz-zukertort-86','morphy-paulsen','keres-spassky-55','spassky-tal-73','bronstein-ljubojevic-73','carlsen-nakamura-11','fischer-reshevsky-61','kramnik-aronian-07','anand-carlsen-14','morphy-anderssen-58'];
for (const key of failed) {
    const pattern = "'" + key + "'";
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes(pattern)) {
            console.log((i+1) + ': ' + key);
            break;
        }
    }
}
