const formatId = (id: string) => {
  let blockNo = id.split('-')[0] || '0'
  blockNo = blockNo.replace(/^0+/, '')
  let index = id.split('-')[2] || '0'
  index = index.replace(/^0+/, '')
  if(index === '') index = '0'
  return `${blockNo}-${index}`
}

// 1st 6 chars of the id ... and last 6 chars
const formatHash = (id: string) => {
  return `${id.substr(0, 6)}...${id.substr(-6)}`      
}

export { formatId, formatHash }
