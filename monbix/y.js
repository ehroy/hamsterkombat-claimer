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
  const formattedData= '1727189084604|444.617|168.376|-0.649|378.455|97.975|1|70|62;1727189088930|316.465|180.218|0.422|359.458|96.337|1|30|170;1727189094507|445.260|168.012|-0.654|378.569|98.023|1|30|185;1727189099639|290.857|169.276|0.632|0.000|0.000|0|48|53;1727189104202|394.704|185.745|-0.236|370.664|95.851|1|70|177;1727189110031|281.488|163.681|0.707|353.623|98.283|1|50|109;1727189115444|280.589|163.089|0.714|353.454|98.360|1|30|112;1727189120958|435.340|173.154|-0.573|376.868|97.362|1|50|180;1727189126074|297.169|172.514|0.581|0.000|0.000|1|95|139'
  const result = parseFormattedData(formattedData);
  console.log(result);
//   console.log();

  