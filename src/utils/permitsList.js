// 權限列表
export function getPermitList() {
  const permitList = JSON.parse(localStorage.getItem('permits'))
  return permitList
}

export function setPermitList(list) {
  return localStorage.setItem('permits', JSON.stringify(list))
}

export function removePermitList() {
  return localStorage.removeItem('permits')
}
