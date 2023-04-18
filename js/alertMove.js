let alertMove = (path,msg)=>{
    return `
    <script>
      alert('${msg}')
      location.href = '${path}'
    </script>`
}

export default alertMove;