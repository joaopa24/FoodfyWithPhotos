const Chef = require("../models/chef")
const File = require("../models/file")

module.exports = {
    async chefs(req, res) {
        let results = await Chef.all()
        const Chefs = results.rows

        return res.render("chef", { Chefs })
    },
    async chefsAdmin(req, res) {
        let results = await Chef.all()
        const Chefs = results.rows

        return res.render("Admin/chefs", { Chefs })
    },
    async chefAdmin(req, res) {
    
        results = await Chef.find(req.params.id).then()
        const chef = results.rows[0] // Não colocar Chef porque buga , já que é o mesmo que o Chef do model
    
        results = await Chef.findrecipes()
        const chef_recipes = results.rows
 
        results = await Chef.allrecipes()
        const recipes = results.rows

        return res.render('Admin/chef', { Chef: chef, chef_recipes, recipes })
    },
    async chefAdmin_edit(req, res) {
        let results = await Chef.find(req.params.id)
        const chef = results.rows[0]
        
        return res.render('Admin/editchef', { Chef: chef })
    },
    chefsCreate(req, res) {
        return res.render('Admin/createChef')
    },
    async post(req, res) {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "") {
                return res.send("Preencha todos os campos!")
            }
        }
        
        if(req.files.length == 0){
            return res.send('Porfavor enfie uma imagem')
        }

        req.files.forEach(files => {
            await File.create()
        })
        let results = await Chef.create(req.body)
        const chefId = results.rows[0].id
        
        return res.redirect(`/admin/Chefs/${chefId}`)
    },
    async put(req, res) {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "") {
                return res.send("Preencha todos os campos!")
            }
        }
        
        let results = await Chef.update(req.body)
        const chefId = results.rows[0].id

        return res.redirect(`/admin/Chefs/${chefId}`)
    },
    async delete(req, res) {
        await Product.delete(req.body.id)

        return res.redirect("/admin/Chefs")
    }
}