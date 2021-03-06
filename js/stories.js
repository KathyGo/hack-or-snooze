'use strict';

// This is the global list of the stories, an instance of StoryList
let storyList;
let storyToUpdate;

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
			return '<i class="fas fa-star star-icon"></i>';
		} else {
			return '<i class="far fa-star star-icon"></i>';
		}
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

/** Gets story details from inputs and add the new story to story list on page 
 *  Validate story inputs
*/

async function addNewStoryOnPage(evt) {
	console.debug('addNewStoryOnPage');
	evt.preventDefault();

	// grab all info from form
	const title = $('#story-title').val();
	const url = $('#story-url').val();
	const author = $('#story-author').val();
	const username = currentUser.username;
	const storyData = { title, url, author };
	const story = await storyList.addStory(currentUser, storyData);

	const $story = generateStoryMarkup(story);
	$allStoriesList.prepend($story);

	// hide the form and reset it
	$addStoryForm.slideUp('slow');
	$addStoryForm.trigger('reset');
}

$addStoryForm.on('submit', addNewStoryOnPage);

/** put list of my own stories on page */

function putMyStoriesOnPage() {
	$allMyStoriesList.empty();
	if (currentUser.ownStories.length === 0) {
		$allMyStoriesList.append('<h5>No stories has been added by this user!</h5>');
	} else {
		for (let story of currentUser.ownStories) {
			const $story = generateStoryMarkup(story);
			$allMyStoriesList.append($story);
		}
		$('.star-icon').before('<i class="far fa-trash-alt delete-icon"></i>');
		$('.star-icon').after('<a href="#" class="story-edit">edit</a>');
	}

	$allMyStoriesList.show();
}

/** Show update story form on click edit link */
function editMyStory(evt) {
	const storyEle = evt.target.closest('li');
	const storyId = storyEle.id;
	storyToUpdate = storyList.stories.find((s) => s.storyId === storyId);

	$updateStoryForm.show();
	$('#update-story-author').val(`${storyToUpdate.author}`);
	$('#update-story-title').val(`${storyToUpdate.title}`);
	$('#update-story-url').val(`${storyToUpdate.url}`);
}

$allMyStoriesList.on('click', '.story-edit', editMyStory);

/** Update story and put own stories on page */

async function updateStory(evt) {
	evt.preventDefault();

	const title = $('#update-story-title').val();
	const url = $('#update-story-url').val();
	const author = $('#update-story-author').val();
	const storyData = { title, url, author };
	const storyId = storyToUpdate.storyId;
	console.log(storyData);
	await storyList.updateStory(currentUser, storyId, storyData);
	$updateStoryForm.hide();
	putMyStoriesOnPage();
}

$updateStoryForm.on('submit', updateStory);

/** put favorites stories on page */

function putFavoriteStoriesOnPage() {
	$allFavoritesList.empty();
	if (currentUser.favorites.length === 0) {
		$allFavoritesList.append('<h5>No favorite story by this user!</h5>');
	} else {
		for (let story of currentUser.favorites) {
			const $story = generateStoryMarkup(story);
			$allFavoritesList.append($story);
		}
	}

	$allFavoritesList.show();
}

/** toggle star icon to favorite/unfavorite a story */

async function toggleFavoriteStory(evt) {
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

$('#story-list-container').on('click', '.star-icon', toggleFavoriteStory);

/** delete a story from my stories page */

async function deleteStory(evt) {
	const storyEle = evt.target.closest('li');
	const storyId = storyEle.id;

	await storyList.removeStory(currentUser, storyId);
	putMyStoriesOnPage();
}

$allMyStoriesList.on('click', '.delete-icon', deleteStory);
