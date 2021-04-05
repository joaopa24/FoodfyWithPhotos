const Recipe = require("../models/recipe")

module.exports = {
    async home(req, res) {
        let { filter , page , limit } = req.query
        page = page || 1
        limit = limit || 6
        let offset = limit * (page - 1)

        let results = await Recipe.chefsOption()
        const chefsOptions = results.rows
        
        const params = {
            filter,
            limit,
            offset
        }
        
        results = await Recipe.paginate(params)
        const recipes = results.rows
        
        return res.render("home", { chefsOptions, recipes, filter })
    },
    recipes(req, res) {
        let { filter , page , limit } = req.query
          
        page = page || 1
        limit = limit || 6
        let offset = limit * (page - 1)

        const params = {
            filter,
            page,
            limit,
            offset,
            callback(recipes){
                const pagination = {
                    total: Math.ceil(recipes[0].total/ limit),
                    page
                }
                Recipe.chefsOption(function (chefsOptions) {
                    return res.render("receitas", { chefsOptions, recipes, pagination, filter })
                })
            }
        }
        Recipe.paginate(params)
    },
    results(req,res){
        let { filter , page , limit } = req.query
          
        page = page || 1
        limit = limit || 6
        let offset = limit * (page - 1)

        const params = {
            filter,
            page,
            limit,
            offset,
            callback(recipes){
                if (recipes == 0) {
                    const pagination = { page }
                    console.log(recipes.length)
                    console.log("if")
                    Recipe.chefsOption(function (chefsOptions) {
                        return res.render("results", { chefsOptions, recipes, pagination, filter })
                    })
                } else {
                    console.log(recipes.length)
                    console.log("else")
                    const pagination = {
                        total: Math.ceil(recipes[0].total/ limit),
                        page,
                    }
                    Recipe.chefsOption(function (chefsOptions) {
                        return res.render("results", { chefsOptions, recipes, pagination, filter })
                    })
                }
            }
        }
        Recipe.paginate(params)
    },
    about(req, res) {
        return res.render("sobre")
    },
    recipe(req, res) {
        const id = req.params.id;

        Recipe.find(id, function (recipe) {
            Recipe.chefsOption(function (chefsOptions) {
                return res.render("receita", { chefsOptions, recipe })
            })
        })
    },
    index(req, res) {
        Recipe.all(function (recipes) {
            Recipe.chefsOption(function (chefsOptions) {
                return res.render("Admin/index", { chefsOptions, recipes })
            })
        })
    },
    create(req, res) {
        Recipe.chefsOption(function (chefsOptions) {
            return res.render("Admin/create", { chefsOptions })
        })
    },
    recipe_admin(req, res) {
        const id = req.params.id;

        Recipe.find(id, function (recipe) {
            Recipe.chefsOption(function (chefsOptions) {
                return res.render("Admin/recipe", { chefsOptions, recipe })
            })
        })

    },
    recipe_admin_edit(req, res) {
        const { id } = req.params

        Recipe.find(id, function (recipe) {
            if (!recipe) return res.send("Receita não encontrada")
            
            console.log(recipe)
            Recipe.chefsOption(function (chefsOptions) {
                return res.render("Admin/edit", { chefsOptions, recipe })
            })
        })
    },
    post(req, res) {
        const keys = Object.keys(req.body)
        for (key of keys) {
            if (req.body[key] == "")
                return res.send("porfavor preencha todos os campos")
        }

        Recipe.create(req.body, function (recipe) {
            console.log(req.body)
            return res.redirect(`/admin/Receitas/${recipe.id}`)
        })
    },
    put(req, res) {
        const keys = Object.keys(req.body)
        for (key of keys) {
            if (req.body[key] == "") {
                console.log(key)
                return res.send("porfavor preencha todos os campos")
            }
        }
        console.log(req.body)
        Recipe.update(req.body, function () {
            return res.redirect(`/admin/Receitas/${req.body.id}`)
        })
    },
    delete(req, res) {
        const { id } = req.body

        return res.render("/admin/Receitas")
    }
}