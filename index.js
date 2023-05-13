const express = require('express')

class AddonBuilder {
    manifest
    app = express()
    blocks = {}
    toolboxModifier
    theme = {}

    constructor(manifest) {
        this.manifest = manifest
    }

    addBlock(name, data, handler) {
        this.blocks[name] = {
            data,
            handler
        }
    }

    defineTheme(name, themeData) {
        if(this.manifest.data.includes('theme')) throw new Error("Error: <Manifest>.data did not include a theme option")

        this.theme[name] = themeData
    }

    modifyToolbox(callback) {
        this.toolboxModifier = callback
    }

    login(port = 3000) {
        return new Promise((resolve, reject) => {
            try {
                this.app.get("/manifest.json", (_, res) => {
                    res.json(this.manifest)
                })

                if(this.manifest.data.includes("theme")) {
                    this.app.get("/theme/:name", (req, res) => {
                        res.json(this.theme[req.params.name])
                    })
                }

                this.app.get("/blocks/get/data/:blockname", (req, res) => {
                    const { blockname } = req.params

                    res.json(this.blocks[blockname].data)
                })

                this.app.get("/mod/toolbox", (req, res) => {
                    const currentToolbox = req.headers.toolbox

                    const mod = this.toolboxModifier(currentToolbox)

                    res.json(mod)
                })

                this.app.get("/code/:blockname", async (req, res) => {
                    const values = req.query
                    const { blockname } = req.params

                    const code = await this.blocks[blockname].handler(values)

                    res.json({
                        code
                    })
                })
        
                this.app.listen(port, () => {
                    console.log(`Manifest launched on port: ${port}. /manifest.json`)
                    resolve(undefined)
                })
            } catch (error) {
                reject(error)
            }
        })
    }
}

module.exports = AddonBuilder