const chef = require("../models/chef")
const Chef = require("../models/chef")

module.exports = {
    chefs(req, res) {
        Chef.all(function (Chefs) {
            return res.render("chef", { Chefs })
        })
    },
    chefsAdmin(req, res) {
        Chef.all(function (Chefs) {
            return res.render('Admin/chefs', { Chefs })
        })
    },
    chefAdmin(req, res) {
        const { id } = req.params

        Chef.findrecipes(function (chef_recipes) {
            Chef.allrecipes(function (recipes) {
                Chef.find(id, function (Chef) {
                    return res.render('Admin/chef', { Chef, chef_recipes, recipes })
                })
            })
        })

    },
    chefAdmin_edit(req, res) {
        const { id } = req.params
        Chef.find(id, function (Chef) {
            return res.render('Admin/editchef', { Chef })
        })
    },
    chefsCreate(req, res) {
        return res.render('Admin/createChef')
    },
    post(req, res) {
        const keys = Object.keys(req.body)
        for (key of keys) {
            if (req.body[key] == "") {
                return res.send("Preencha todos os campos!")
            }
        }

        Chef.create(req.body, function (Chef) {
            return res.redirect(`/admin/Chefs/${Chef.id}`)
        })
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