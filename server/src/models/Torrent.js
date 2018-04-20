module.exports = (sequelize, DataTypes) => {
const Torrent = sequelize.define('Torrent', {
	imdb_id: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	lang: DataTypes.STRING,
	text_lang: DataTypes.STRING,
	hash: {
		type: DataTypes.STRING,
		unique: true,
		allowNull: false,
	},
	file_path: DataTypes.STRING
})

// Torrent.associate = function (models) {
//   Torrent.belongsTo(models.Movie)
// }

return Torrent
}
