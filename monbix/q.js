function parseFormattedData(formattedData) {
    // Split berdasarkan ';' untuk mendapatkan setiap array bagian dalam
    const dataArray = formattedData.split(";").map((innerString) => {
      // Split berdasarkan '|' untuk mendapatkan setiap nilai dalam array bagian dalam
      return innerString.split("|").map((value) => {
        // Ubah kembali string numerik menjadi number (bilangan bulat atau desimal)
        const parsedValue = parseFloat(value); // Mengubah string menjadi number
        return isNaN(parsedValue) ? value : parsedValue; // Jika bukan angka, kembalikan sebagai string
      });
    });
    
    return dataArray;
  }
  
//   const result = parseFormattedData('1727103021442|385.813|226.124|-0.702|462.687|316.961|1|30|26;1727103025425|324.280|249.458|-0.142|0|0|2|14|115;1727103028873|207.168|206.853|0.958|0|0|2|32|154;1727103030921|202.017|200.206|1.036|0|0|2|91|117;1727103033403|368.600|236.384|-0.529|438.784|356.364|1|30|129;1727103035618|401.892|212.328|-0.891|0|0|1|51|197;1727103038753|332.841|248.155|-0.213|401.470|564.803|2|60|120;1727103046528|341.399|246.308|-0.286|401.738|451.625|1|70|21;1727103052830|346.035|245.070|-0.326|0|0|0|78|144');
const result = parseFormattedData('1727104976634|201.802|199.904|1.040|0|0|0|41|33;1727104978966|296.058|250.083|0.090|282.693|398.483|1|50|105;1727104983315|322.440|249.669|-0.127|365.975|590.903|1|30|35;1727104986647|213.106|213.348|0.878|98.432|308.484|1|70|164;1727104990397|244.213|235.790|0.541|182.969|337.821|2|60|160;1727104995678|335.896|247.560|-0.239|396.058|494.332|1|30|182;1727105000727|317.677|250.103|-0.088|358.284|712.323|1|30|15;1727105005576|352.181|243.157|-0.379|425.879|428.008|1|70|119;1727105010141|227.287|225.477|0.712|0|0|0|81|123;1727105014190|348.665|246.079|-0.349|0|0|2|35|179')
console.log(result)
  let total = 0
result.forEach(element => {
   total +=element[8]
});
console.log(total)
  