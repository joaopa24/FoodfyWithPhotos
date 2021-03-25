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
        // get count of recipes 
        let results = await Chef.findrecipes()
        const chef_recipes = results.rows
        
        // get All recipes 
        results = await Chef.allrecipes()
        const recipes = results.rows

        // find Chef
        results = await Chef.find(req.params.id)
        const Chef = results.rows[0]

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
    put(req, res) {
        const keys = Object.keys(req.body)
        for (key of keys) {
            if (req.body[key] == "") {
                return res.send("Preencha todos os campos!")
            }
        }
        console.log(req.body.id)

        Chef.update(req.body, function () {
            return res.redirect(`/admin/Chefs/${req.body.id}`)
        })
    },
    delete(req, res) {
        Chef.delete(req.body.id, function () {
            return res.redirect("/admin/Chefs")
        })
    }
}