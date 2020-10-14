// Webpack utilise ce module pour travailler avec les dossiers.
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const Dotenv = require("dotenv-webpack");
// Ceci est la configuration principale de ton projet
// Ici, tu peux écrire les différentes options que tu souhaites et dire à Webpack que faire.
module.exports = (env) => {
  console.log("NODE_ENV", env.NODE_ENV);
  return {
    // Ceci est le chemin de ton point d'entrée. C'est depuis ce fichier que Webpack commencera à travailler.
    entry: "./src/js/index.js",
    watch: true,
    watchOptions: {
      aggregateTimeout: 1000
    },
    // Ceci sera le chemin et le nom du fichier qui résultera de ton bundle
    // Webpack va compresser tout ton Javascript dans un seul fichier
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "bundle.js",
    },

    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules)/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        },
        {
          // On applique notre règle pour tous les fichiers .sass, .scss et .cs
          test: /\.(sa|sc|c)ss$/,
      
          // Attention, les loaders sont ajoutés en sens inverse, effectivement, c'est le dernier loader qui est exécuté en premier.
          use: [
            {
              // Ce loader permet d'utiliser url() et @imports dans ton CSS
              loader: "css-loader",
            },
            {
              // Ensuite on ajoute postCSS qui ajoute un minifier ou bien un préfixeur automatique (--moz par exemple)
              loader: "postcss-loader",
            },
            {
              // En premier, on transforme le SASS en CSS
              loader: "sass-loader",
              options: {
                implementation: require("sass"),
              },
            },
          ],
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            {
              // On le met en premier afin qu'il soit executé en dernier, une fois que tous nos changements souhaités soient appliqués à notre CSS.
              loader: MiniCssExtractPlugin.loader,
            },
            {
              loader: "css-loader",
            },
            {
              loader: "postcss-loader",
            },
            {
              loader: "sass-loader",
              options: {
                implementation: require("sass"),
              },
            },
          ],
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/,
          use: [
            {
              loader: "file-loader",
              options: {
                outputPath: 'images'
              }
            }
          ]
        },
        {
          test: /\.(woff|woff2|ttf|otf|eot)$/,
          use: [
            {
              loader: "file-loader",
              options: {
                outputPath: 'fonts'
              }
            }
          ]
        }
      ]
    },

    plugins: [
      new MiniCssExtractPlugin({
        filename: "bundle.css"
      }),
      new Dotenv()
    ],

    // Par défaut, le mode de Webpack est "production". En fonction de ce qui est écrit ici, tu pourras appliquer différentes méthodes dans ton bundle final.
    // Pour le moment, nous avons besoin de paramètres de développement. Nous n'avons, par exemple, pas besoin de minifier notre code, nous allons donc le mettre en "développement"
    mode: "development",
  }
};