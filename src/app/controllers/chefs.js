const Chef = require("../models/chef")
const File = require("../models/file")

module.exports = {
    async chefs(req, res) {
        let results = await Chef.all()
        const Chefs = results.rows

        const chefsPromise = Chefs.map(async chef => {
            results = await Chef.files(chef.id)

            const files = results.rows.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
            }))

            Chef.image = files[0]

            return chef
        })

        const EachChef = await Promise.all(chefsPromise)

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

        if (req.files.length == 0) {
            return res.send('Porfavor enfie uma imagem')
        }

        const filePromise = req.files.map(file => File.create({ ...file }))
        let results = await filePromise[0]
        const file_id = results.rows[0].id

        results = await Chef.create(req.body, file_id)
        const chefId = results.rows[0].id

        return res.redirect(`/admin/Chefs/${chefId}`)
    },
    async put(req, res) {
        const keys = Object.keys(req.body)
        const chef_id = req.body.id


        for (key of keys) {
            if (req.body[key] == "") {
                return res.send("Preencha todos os campos!")
            }
        }

        console.log(req.files)

        await Chef.update(req.body)

        return res.redirect(`/admin/Chefs/${chef_id}`)
    },
    async delete(req, res) {
        await Product.delete(req.body.id)

        return res.redirect("/admin/Chefs")
    }
}