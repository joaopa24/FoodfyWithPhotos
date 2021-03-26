const Chef = require("../models/chef")

module.exports = {
    chefs(req, res) {
        Chef.all()
        .then(function(results){
            const Chefs = results.rows
            return res.render("chef", { Chefs })
        }).catch(function(err){
            throw new Error(err)
        })
    },
    chefsAdmin(req, res) {
        Chef.all()
        .then(function(results){
            const Chefs = results.rows
            return res.render("Admin/chefs", { Chefs })
        }).catch(function(err){
            throw new Error(err)
        })
    },
    async chefAdmin(req, res) {
        
        console.log(req.params.id)
        // find Chef
        let results = await Chef.find(req.params.id)
        const Chef = results.rows[0]
        
        if (!Chef) return res.send("Chef não encontrado!")
        
        // get count of recipes 
        results = await Chef.findrecipes()
        const chef_recipes = results.rows
        
        // get All recipes 
        results = await Chef.allrecipes()
        const recipes = results.rows

        return res.render('Admin/chef', { Chef, chef_recipes, recipes })
    },
    async chefAdmin_edit(req, res) {
        let results = await Chef.find(req.params.id)
        const Chef = results.rows[0]
        
        return res.render('Admin/editchef', { Chef })
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