const alfabeto = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'ñ', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
console.log(alfabeto);

const ntxt = "Qr yfbk pxybp ñrb pmv rkx pblmox ab baxa xsxkwxax v km zmjnobkam bpxp zmpxp ñrb xnobkabp. Ñrfbom abzfoqb ñrb bpqmv jrv modriimpx ab qf, sbm qmam bi bjnblm v abzfaxzfmk ñrb qfbkbp bk zxax zixpb, ixp kmzebp v kmzebp ñrb nxpxp bpqrafxkam. Pb ñrb km bp rk zxjfkm cxzfi, ñrb exv jrzexp nfbaoxp bk bi zxjfkm nbom ñrfbom axoqb xkfjm v ñrb zmk ix abafzxzfmk ñrb qfbkbp bpqmv pbdrox ñrb imdoxoxp zrjnifo zmk qrp mygbqfsmp.";
const txt = ntxt.toLowerCase();
let letra = '';
let txtResult = '';
let nletra = 0;
let txtLetra = '';

for (var i = 0; i < txt.length; i++) {

  txtLetra = txt.charAt(i);
  nletra = alfabeto.indexOf(txtLetra);

  if (txtLetra === ' ' || txtLetra === '.' || txtLetra === ',') {
    letra = txtLetra;
  } else {
    nuevaLetra = nletra + 3;

    if (nuevaLetra > alfabeto.length - 1) {
      nuevaLetra = nuevaLetra - alfabeto.length;
    }
    letra = alfabeto[nuevaLetra];
  }

  txtResult = txtResult + letra;
  console.log(`let ${txtLetra} nletra ${nletra} nuevalet ${nuevaLetra} letra ${letra}`);
}

console.log(txtResult);