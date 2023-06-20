module.exports = {
    plugins: [
        require('postcss-import'),
        require('tailwindcss')(require('./tailwind.config.cjs')),
        require('autoprefixer'),
        require('postcss-preset-env')({
            stage: 0
        }),
    ]
}