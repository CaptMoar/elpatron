app.get('/', (req, res) => {
    res.send(`yi boi`)
  });
  
  app.post('/resumen', (req, res) => {
    var params = {
      TableName: 'ssff-informe-resumen', 
      FilterExpression: 'contains(fecha, :fecha)',
      ExpressionAttributeValues: {
        ":fecha": {"S": new Date(Date.now()).toISOString().split('T')[0]}
        //":fecha": {"S": "2020-08"}
      }       
    }
  
    docClient.scan(params, async (err, result) => {
      if (err) {
        console.log(`[ERR] ${err}`)
      } else {
        const { items } = await result
        res.json({
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },  
          body: result
        });
      }
    });
  });
  
  app.post('/resumen/getByRut', (req, res) => {
    var params = {
      TableName: "ssff-informe-resumen",
      FilterExpression: 'contains(rut, :rut)',
      ExpressionAttributeValues: {
        //":rut": {"S": "12019183-7"}
        ":rut": {"S": JSON.parse(req.body.toString('utf8')).rut} 
      }  
    }
    docClient.scan(params, async (err, result) => {
      if (err) {
        console.log(`[ERR] ${err}`)
      } else {
        const { items } = await result
        res.json({
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          }, 
          body: result
        });
      }
    });
  });
  
  app.post('/resumen/getByFecha', (req, res) => {
    var params = {
      TableName: "ssff-informe-resumen",
      FilterExpression: 'fecha = :fecha',
      ExpressionAttributeValues: {
        //":fecha": {"S": "2020-07-23"}     
        ":fecha": {"S": JSON.parse(req.body.toString('utf8')).fecha} 
      }  
    }
    docClient.scan(params, async (err, result) => {
      if (err) {
        console.log(`[ERR] ${err}`)
      } else {
        const { items } = await result
        res.json({
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          }, 
          body: result
        });
      }
    });
  });
  
  app.post('/resumen/getByEstado', (req, res) => {
    var params = {
      TableName: "ssff-informe-resumen",
      FilterExpression: 'estado = :estado',
      ExpressionAttributeValues: {
        //":estado": {"S": "EN PROCESO"}     
        ":estado": {"S": JSON.parse(req.body.toString('utf8')).estado} 
      }  
    }
    docClient.scan(params, async (err, result) => {
      if (err) {
        console.log(`[ERR] ${err}`)
      } else {
        const { items } = await result
        res.json({
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          }, 
          body: result
        });
      }
    });
  });
  
  app.post('/auditoria/getById', (req, res) => {
    var params = {
      KeyConditionExpression: 'id_audio = :id_audio',
      ExpressionAttributeValues: {      
        ':id_audio': {'S': JSON.parse(req.body.toString('utf8')).id_audio}
      },
      TableName: "ssff-informe" 
    }  
    docClient.query(params, async (err, result) => {
      if (err) {
        console.log(`[ERR] ${err}`)
      } else {
        const { items } = await result
        res.json({
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          }, 
          body: result
        });
      }
    });
  });
  
  app.post('/auditoria/guardarCaso', (req, res) => {
    let motivoRechazo = ''
    let observacion = ''    
    if (!JSON.parse(req.body.toString('utf8')).motivoRechazo || !JSON.parse(req.body.toString('utf8')).observacion) {
      motivoRechazo = ''
      observacion = ''
    }
    else {
      motivoRechazo = JSON.parse(req.body.toString('utf8')).motivoRechazo
      observacion = JSON.parse(req.body.toString('utf8')).observacion
    }
    var paramsResumen = {
      TableName: "ssff-informe-resumen",
      Key: {      
        id_audio: JSON.parse(req.body.toString('utf8')).id_audio
      },
      UpdateExpression: "set motivoRechazo = :motivoRechazo, observacion = :observacion, estado = :estado",
      ExpressionAttributeValues:{      
        ":motivoRechazo": motivoRechazo,
        ":observacion": observacion,
        ":estado": "GESTIONADO",
      },
      ReturnValues:"UPDATED_NEW"
    }  
  
    docClientUpd.update(paramsResumen, async (err, result) => {
      console.log('1 UPDATE ssff-informe-resumen')
      if (err) {
        console.log(`[ERR] ${err}`)
      } else {
        const { items } = await result
        console.log(`[INFO] ${items}`)
      }
    });  
    
    const entidades = JSON.parse(req.body.toString('utf8')).data;
  
    entidades.forEach(element => {
      
      var paramsInforme = {
        TableName: "ssff-informe",
        Key: {
          id_audio: element.id_audio.S,
          entidad: element.entidad.S
        },
        UpdateExpression: "set validarEstado = :validarEstado",
        ExpressionAttributeValues:{        
          ":validarEstado": element.validarEstado.BOOL,
        },
        ReturnValues:"UPDATED_NEW"
      }  
      
      docClientUpd.update(paramsInforme, async (err, result) => {
        console.log('2 UPDATE ssff-informe')
        if (err) {
          console.log(`[ERR] ${err}`)
        } else {
          const { items } = await result       
          console.log(`[INFO] ${items}`) 
        }
      });    
    });
    console.log('------FIN------')
    res.json({
      statusCode: 200,         
      body: 'OK'
    });
  
  });
  
  app.post('/auditoria/getByAudio', (req, res) => {
    var params = {
      Bucket: 'ssff-auditoria-convenios',
      //Key: '2020241999.mp3',
      Key: JSON.parse(req.body.toString('utf8')).id_audio + '.mp3',
      Expires: 60 * 5
    }
    
    try{
      var url = s3.getSignedUrl('getObject', params);
      //console.log(url)
      res.json({
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        }, 
        body: url
      });   
    } catch(err) {
      console.log(err)
    }
  
  });
  
  app.post('/informe', (req, res) => {
    var params = {
      TableName: 'ssff-informe',
      Limit: 20,
    };
  
    docClient.scan(params, async (err, result) => {
      if (err) {
        console.log(`[ERR] ${err}`)
      } else {
        const { items } = await result
        res.json({
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },     
          body: result
        });
      }
    });
  });