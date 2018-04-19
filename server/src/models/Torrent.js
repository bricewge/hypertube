module.exports = (sequelize, DataTypes) => {
const Torrent = sequelize.define('Torrent', {
	imdb_id: DataTypes.STRING,
	lang: DataTypes.STRING,
	text_lang: DataTypes.STRING,
	hash: {
		type: DataTypes.STRING,
		unique: true
	},
	file_path: DataTypes.STRING
})

return Torrent
}
