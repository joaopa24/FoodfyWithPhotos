const express = require('express')
const routes = express.Router()
const multer = require('./app/middlewares/multer')
const recipes = require('./app/controllers/recipes')
const chef = require('./app/controllers/chefs')

routes.get("/", recipes.home)
routes.get("/Receitas", recipes.recipes)
routes.get("/Sobre", recipes.about)
routes.get("/Receitas/:id", recipes.recipe)
routes.get("/Resultados", recipes.results)

routes.get("/Chefs", chef.chefs)
routes.get("/admin/Chefs", chef.chefsAdmin)
routes.get("/admin/Chefs/criar", chef.chefsCreate)
routes.get("/admin/Chefs/:id", chef.chefAdmin)
routes.get("/admin/Chefs/:id/edit", chef.chefAdmin_edit)
routes.post("/admin/Chefs", multer.array("photos", 1),chef.post)
routes.put("/admin/Chefs", chef.put)
routes.delete("/admin/Chefs", chef.delete)


routes.get("/admin/Receitas", recipes.index)
routes.get("/admin/Receitas/criar", recipes.create)
routes.get("/admin/Receitas/:id", recipes.recipe_admin)
routes.get("/admin/Receitas/:id/edit", recipes.recipe_admin_edit)
routes.put("/admin/Receitas", recipes.put)
routes.delete("/admin/Receitas", recipes.delete)
routes.post("/admin/Receitas", recipes.post)


module.exports = routes
