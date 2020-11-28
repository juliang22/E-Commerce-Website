import React from 'react'
import PropTypes from 'prop-types'

const Rating = ({ value, numReviews, color }) => {
	let stars = new Array(5).fill(0) //mapping over 5 stars and if the idx of each star is greater than the amount, it should be full, then half or no star
	let star = (count) => (
		<span key={Math.random()}>
			<i style={{ color: color }}
				className={
					value >= count
						? 'fas fa-star'
						: value >= count - .5
							? 'fas fa-star-half-alt'
							: 'far fa-star'
				}>
			</i>
		</span>
	)
	return (
		<div className="rating">
			{stars.map((_, i) => star(i + 1))}
			<span>{numReviews && numReviews}</span>
		</div>
	)
}

Rating.defaultProps = {
	color: '#FFD700'
}

Rating.propTypes = {
	value: PropTypes.number.isRequired,
	numReviews: PropTypes.string.isRequired,
	color: PropTypes.string
}

export default Rating
