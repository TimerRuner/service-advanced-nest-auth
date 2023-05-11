export function filterPrivateFields(object, privateFields){
  privateFields.forEach(key => {
    delete object[key]
  })
  return object
}