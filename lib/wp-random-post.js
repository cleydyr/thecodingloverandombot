
const WPAPI = require( 'wpapi' );

const getRandomPost = (endpoint) => {
	const getRandomInt = (min) => (max) => {
		return Math.floor(Math.random() * (max - min)) + min;
	};

	const wp = new WPAPI({ endpoint, });

	const getTotalPosts = () =>
		wp.posts()
			.headers()
			.then(headers => headers['x-wp-total']);

	const getNthPost = (n) =>
		wp.posts()
			.param('offset', n)
			.param('per_page', 1)
			.then(([singlePost]) => singlePost);

	return getTotalPosts()
		.then(total => getNthPost(getRandomInt(0)(total-1)))
}

module.exports = getRandomPost;