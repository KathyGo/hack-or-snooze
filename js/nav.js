'use strict';

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
	console.debug('navAllStories', evt);
	hidePageComponents();
	putStoriesOnPage();
}

$body.on('click', '#nav-all', navAllStories);

/** Show add story form on click on "submit" */

function navSubmitStory(evt) {
	console.debug('navSubmitStory', evt);
	hidePageComponents();
	$allStoriesList.show();
	$addStoryForm.show();
}

$('#nav-submit').on('click', navSubmitStory);

/** Show users favorites storys on click on "favorites" */
function navFavoriteStories(evt) {
	console.debug('navFavoritesStories', evt);
	hidePageComponents();
	putFavoriteStoriesOnPage();
}

$('#nav-favorites').on('click', navFavoriteStories);

/** Show users owned storys on click on "my stories" */
function navMyStories(evt) {
	console.debug('navMyStories', evt);
	hidePageComponents();
	putMyStoriesOnPage();
}

$navMyStories.on('click', navMyStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
	console.debug('navLoginClick', evt);
	hidePageComponents();
	$loginForm.show();
	$signupForm.show();
}

$navLogin.on('click', navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
	console.debug('updateNavOnLogin');
	$('.main-nav-links').show();
	$navLogin.hide();
	$navLogOut.show();
	$navUserProfile.text(`${currentUser.username}`).show();
}
