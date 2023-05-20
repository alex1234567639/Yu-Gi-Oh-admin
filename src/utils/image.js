// upload相片後判斷長寬限制、回傳相片名稱&資訊
export function uploadImage(img, callback, err, widthLimit = 20000, heightLimit = 20000) {
  const reader = new FileReader()
  reader.readAsDataURL(img.target.files[0])
  reader.onload = function(e) {
    const image = new Image()
    image.onload = function() {
      const width = image.width
      const height = image.height
      if (width > widthLimit || height > heightLimit) {
        err('sizeTooLarge')
        return
      }
      const imgDetail = {
        name: img.target.files[0].name,
        result: e.target.result
      }
      callback(imgDetail)
    }
    image.src = e.target.result
  }
}
