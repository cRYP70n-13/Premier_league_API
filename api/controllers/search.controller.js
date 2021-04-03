import validate from '../utils/validate';

class SearchController {
	constructor(searchService) {
		this.searchService = searchService;
	}

	async searchTeam(req, res) {
		const errors = validate.teamSearchValidate(req);

		if (errors.length > 0) {
			return res.status(400).json({
				status: 400,
				success: false,
				errors
			});
		}

		// The Request query params passed are validated so ...
		const { name } = req.query;

		try {
			const searchResult = await this.searchService.searchTeam(name);

			return res.status(200).json({
				status: 200,
				success: true,
				data: searchResult
			});
		} catch (e) {
			return res.status(500).json({
				status: 500,
				success: false,
				error: error.message
			});
		}
	}

	async searchFixture(req, res) {
		const errors = validate.fixtureSearchValidate(req);

		if (errors.length > 0) {
			return res.status(400).json({
				status: 400,
				success: false,
				errors
			})
		}

		//The request query parameters passed are validated above
		const { home, away, matchday, matchtime } = req.query;
		const searchTerm = { home, away, matchday, matchtime };

		try {
			const searchResult = await this.searchService.searchFixture(searchTerm);

			if (searchResult) {
				return res.status(200).json({
					status: 200,
					success: true,
					data: searchResult
				});
			} else { //when undefined is returned
				return res.status(200).json({
					status: 200,
					success: true,
					data: []
				})
			}
		} catch(error) {
			return res.status(500).json({
				status: 500,
				success: false,
				error: error.message
			});
		}
	}
}

export default SearchController;
