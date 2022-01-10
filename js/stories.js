'use strict';

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
	storyList = await StoryList.getStories();
	$storiesLoadingMsg.remove();

	putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
	//	console.debug('generateStoryMarkup', story);
	const hostName = story.getHostName();
	const $starMarkup = generateFavoriteMarkup(story);

	return $(`
      <li id="${story.storyId}">
      ${$starMarkup}
      <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Create HTML for star element before each story if user logged in, otherwise, no star element. */

function generateFavoriteMarkup(story) {
	if (currentUser) {
		if (currentUser.favorites.some((s) => s.storyId === story.storyId)) {
			return '<i class="fas fa-star"></i>';
		} else {
			return '<i class="far fa-star"></i>';
		}
	} else {
		return '';
	}
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
	console.debug('putStoriesOnPage');

	$allStoriesList.empty();

	// loop through all of our stories and generate HTML for them
	for (let story of storyList.stories) {
		const $story = generateStoryMarkup(story);
		$allStoriesList.append($story);
	}

	$allStoriesList.show();
}

/** Gets story details from inputs and add the new story to story list on page */

async function addNewStoryOnPage(evt) {
	console.debug('addNewStoryOnPage');

	// evt.preventDefault();
	// const author = $('#story-author').val();
	// const title = $('#story-title').val();
	// const url = $('#story-url').val();
	// const username = currentUser.username;
	// const newStory = { author, title, url, username };

	// const story = await storyList.addStory(currentUser, author, title, url);
	// putStoriesOnPage();

	console.debug('submitNewStory');
	evt.preventDefault();

	// grab all info from form
	const title = $('#create-title').val();
	const url = $('#create-url').val();
	const author = $('#create-author').val();
	const username = currentUser.username;
	const storyData = { title, url, author, username };

	const story = await storyList.addStory(currentUser, storyData);

	const $story = generateStoryMarkup(story);
	$allStoriesList.prepend($story);

	// hide the form and reset it
	$submitForm.slideUp('slow');
	$submitForm.trigger('reset');
}

$('#add-story-submit').on('click', addNewStoryOnPage);

// curl -i \
//      -H "Content-Type: application/json" \
//      -X POST \
//      -d '{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ikx1Y2t5X1l1ZSIsImlhdCI6MTY0MTY2NjQ3MX0.FzvffswHqJvTNE73n5NA1-4MKWRlLKHD9gKM-YTCn0s", "story": {"author":"Elie Schoppik","title":"Four Tips for Moving Faster as a Developer", "url": "https://www.rithmschool.com/blog/developer-productivity"} }' \
//       https://hack-or-snooze-v3.herokuapp.com/stories

async function addFavoriteStory(evt) {
	const storyEle = evt.target.closest('li');
	const storyId = storyEle.id;
	const story = storyList.stories.find((s) => s.storyId === storyId);

	if (evt.target.className.includes('far')) {
		$(evt.target).toggleClass('far fas');
		await currentUser.addFavorite(story);
	} else if (evt.target.className.includes('fas')) {
		$(evt.target).toggleClass('far fas');
		await currentUser.removeFavorite(story);
	}
}

$allStoriesList.on('click', 'i', addFavoriteStory);
