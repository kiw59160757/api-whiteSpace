  exports.ChangeNumberToCode = async (number) => {
    return new Promise(async (resolve, reject) => {
      try {
        const newNumber = number
        let lengthNumber = newNumber.length;
        const formatNumber = "00000000";
        const lengthFormat = formatNumber.length
        const result = formatNumber.substr(lengthNumber, lengthFormat) +
        newNumber
        resolve(result)
      } catch (error) {
        reject(error)
      }
    })
  }
  