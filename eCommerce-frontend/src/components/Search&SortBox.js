import React from 'react'
import { Form, Button } from 'react-bootstrap'

const SearchBox = ({ queryHandler, setQuery, filter, filterHandler, query }) => {

	return (

		<Form inline style={{ display: 'flex', justifyContent: 'space-between' }} onSubmit={(e) => {
			e.preventDefault()
			queryHandler(query)
		}}>
			<Form.Group>
				<Form.Control
					as='input'
					type='text'
					// onChange={queryHandler}
					onChange={(e) => setQuery(e.target.value)}
					placeholder='Search Products...'
					className='mr-sm-2 ml-sm-5 outline'
					style={{ outline: 'red', borderWidth: '2px' }}
				>
				</Form.Control>
				<Button onClick={() => queryHandler(query)} variant='outline-success' className='p-2'>
					Search
      			</Button>
			</Form.Group>
			<Form.Group md={{ span: 4, offset: 4 }}>
				<Form.Control
					as='select'
					value={filter}
					onChange={filterHandler}
				>
					<option value=''>Filter By...</option>
					<option value='rating'>Rating</option>
					<option value='numReviews'>Number of Reviews</option>
					<option value='price'>Price</option>
					<option value='countInStock'>Amount in Stock</option>
				</Form.Control>
			</Form.Group>
		</Form >






	)
}

export default SearchBox