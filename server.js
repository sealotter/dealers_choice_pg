const express = require('express')
const app = express()

const {client, syncAndSeed} = require('./db')
const path = require('path')
app.use('/assets', express.static(path.join(__dirname, 'assets')))

app.get('/', async(req, res, next) => {
    //interacting with an external resource means things can go wrong, add try catch
   try{
       const response = await client.query('SELECT * FROM company;')
       const companies = response.rows

       res.send(`
       <html>
        <head>
            <title>Brew Companies</title>
            <link rel='stylesheet' href= '/assets/style.css'>
        </head>
        <h1>Select a Brewery and Learn about their Brews</h1>
        <ul>
            ${
                companies.map(company => `
                    <a href = '/company/${company.id}'><li>${company.name}</li></a>
                
                `).join('')
            }

        <ul>
       </html>
       
       `)

   }catch(ex) {
       next(ex)

   }
})


app.get('/company/:id', async(req, res, next) => {
  
   try{
       //creating promises to call both responses at the same time since order doesn't matter (not dependent)
       const promises = [
           client.query('SELECT * FROM company WHERE id = $1;', [req.params.id]),
           
           client.query('SELECT * FROM brews WHERE company_id = $1;', [req.params.id])

       ]

       const responsePromises  = await Promise.all(promises)
       const company = responsePromises[0].rows[0]
       const brews = responsePromises[1].rows
       


       
       //const companyResponse = await client.query('SELECT * FROM company WHERE id = $1;', [req.params.id])
       
       //const brewsResponse = await client.query('SELECT * FROM brews WHERE company_id = $1;', [req.params.id])
       //const brews = brewsResponse.rows
       
       

       res.send(`
       <html>
        <head>
            <title>About the Company Brew</title>
            <link rel='stylesheet' href= '/assets/style.css'>
        </head>
        <a href ='/'><h3> Back to Breweries</h3></a>
       
        
        <h1>All about ${company.name} & their brews</h1>

        
            ${brews.map(brew => 
                `
                <h3>If you like <span> ${brew.type}</span> beer then you'll love their famous <span>${brew.brew_name}</span> brew!</h3>

                <p>${brew.about}</p>

               
                `).join('')
                
            }
           
       
        


       <p>
       Like what you see? Come visit the brewery located at <span>${company.address}</span>
       </p>

     
       </html>
       
       `)

   }catch(ex) {
       next(ex)

   }
})



const init = async() => {
    try{
        await client.connect()
        await syncAndSeed()
        const port = process.env.DATABASE_URL || 3000
        app.listen(port, () => console.log(`listening on port ${port}`))

    }catch(ex) {
        console.log(ex)
    }

}
init()

