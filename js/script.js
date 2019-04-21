'use strict';
//Title Click Handler
function titleClickHandler(event) {
	const activeLinks = document.querySelectorAll('.titles a.active');

	for (let activeLink of activeLinks) {
		/* remove class 'active' from all article links  */
		activeLink.classList.remove('active');
	}

	event.preventDefault();
	const clickedElement = this;
	clickedElement.classList.add('active'); /* add class 'active' to the clicked link */
	const activeArticles = document.querySelectorAll('.posts .post');

	for (let activeArticle of activeArticles) {
		activeArticle.classList.remove('active'); /* remove class 'active' from all articles */
	}

	const articleSelector = clickedElement.getAttribute('href'); /* get 'href' attribute from the clicked link */
	/* find the correct article using the selector (value of 'href' attribute) */
	const targetArticle = document.querySelector(articleSelector);
	targetArticle.classList.add('active'); /* add class 'active' to the correct article */
}

//Generate Title Links

const optArticleSelector = '.post';
const optTitleSelector = '.post-title';
const optTitleListSelector = '.titles';
const optArticleTagsSelector = '.post-tags .list';
const optArticleAuthorSelector = '.post .post-author';
const optTagsListSelector = '.sidebar .tags';
const optAuthorsListSelector = '.sidebar .authors';
const optCloudClassCount = 5;
const optCloudClassPrefix = 'tag-size-';

function generateTitleLinks(customSelector = '') {
	/* remove contents of titleList */
	const titleList = document.querySelector(optTitleListSelector);
	titleList.innerHTML = '';

	const articles = document.querySelectorAll(optArticleSelector + customSelector);

	let html = '';

	/* for each article */
	for (let article of articles) {
		/* get the article id */
		const articleId = article.getAttribute('id');

		/* get the title from the title element */
		const articleTitle = article.querySelector(optTitleSelector).innerHTML;
		/* create HTML of the link */

		const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
		html = html + linkHTML;
	}
	/* insert link into titleList */
	titleList.innerHTML = html;

	const links = document.querySelectorAll('.titles a');

	for (let link of links) {
		link.addEventListener('click', titleClickHandler);
	}
}
generateTitleLinks();

//!!!! PARAMS !!!!!
function calculateTagClass(count, params) {
	const normalizedCount = count - params.min;
	const normalizedMax = params.max - params.min;
	const percentage = normalizedCount / normalizedMax;
	const classNumber = Math.floor(percentage * (optCloudClassCount - 1) + 1);

	return optCloudClassPrefix + classNumber;
}

function calculateTagsParams(tags) {
	const params = {
		max: 0,
		min: 999999,
	};
	for (let tag in tags) {
		params.max = Math.max(tags[tag], params.max);
		params.min = Math.min(tags[tag], params.min);
	}
	return params;
}

//!!!! TAGS !!!!!

//Generate Tags

function generateTags() {
	let allTags = {}; /* [NEW] create a new variable allTags with an empty array */
	const articles = document.querySelectorAll(optArticleSelector); /* find all articles */

	for (let article of articles) {
		/* START LOOP: for every article: */
		const tagWrapper = article.querySelector(optArticleTagsSelector); /* find tags wrapper */
		let html = ''; /* make html variable with empty string */
		const articleTags = article.getAttribute('data-tags'); /* get tags from data-tags attribute */
		const articleTagsArray = articleTags.split(' '); /* split tags into array */

		for (let tag of articleTagsArray) {
			/* START LOOP: for each tag */
			const linkHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>'; /* generate HTML of the link */
			html = html + linkHTML; /* add generated code to html variable */
			/* [NEW] check if this link is NOT already in allTags */
			if (!allTags.hasOwnProperty(tag)) {
				allTags[tag] = 1; /* [NEW] add generated code to allTags array */
			} else {
				allTags[tag]++;
			}
		} /* END LOOP: for each tag */

		tagWrapper.innerHTML = html; /* insert HTML of all the links into the tags wrapper */
	} /* END LOOP: for every article: */

	const tagList = document.querySelector('.tags'); /* [NEW] find list of tags in right column */
	//tagList.innerHTML = allTags.join(' '); /* [NEW] add html from allTags to tagList */
	const tagsParams = calculateTagsParams(allTags);
	let allTagsHTML = '';
	for (let tag in allTags) {
		//allTagsHTML += '<a href="#tag-' + tag + '" class="">' + tag + '(' + allTags[tag] + ') ' + '</a>';
		const tagLinkHTML =
			'<li><a href="#tag-' +
			tag +
			'" class="' +
			calculateTagClass(allTags[tag], tagsParams) +
			'">' +
			tag +
			' </a></li>';
		allTagsHTML += tagLinkHTML;
	}
	tagList.innerHTML = allTagsHTML;
}

generateTags();

function tagClickHandler(event) {
	event.preventDefault(); /* prevent default action for this event */
	const clickedElement = event.target; /* make new constant named "clickedElement" and give it the value of "this" */
	/* make a new constant "href" and read the attribute "href" of the clicked element */

	const href = clickedElement.getAttribute('href');
	const tag = href.replace('#tag-', ''); /* make a new constant "tag" and extract tag from the "href" constant */

	/* find all tag links with class active */
	const activeTags = document.querySelectorAll('a.active[href^="#tag-"]');

	/* START LOOP: for each active tag link */
	for (let activeTag of activeTags) {
		activeTag.classList.remove('active'); /* remove class active */
	} /* END LOOP: for each active tag link */

	/* find all tag links with "href" attribute equal to the "href" constant */
	const tagLinks = document.querySelectorAll('a[href="' + href + '"]');

	/* START LOOP: for each found tag link */
	for (let tagLink of tagLinks) {
		tagLink.classList.add('active'); /* add class active */
	} /* END LOOP: for each found tag link */

	/* execute function "generateTitleLinks" with article selector as argument */
	generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags() {
	const tagLinks = document.querySelectorAll(optArticleTagsSelector); /* find all links to tags */
	/* START LOOP: for each link */
	for (let tagLink of tagLinks) {
		tagLink.addEventListener('click', tagClickHandler); /* add tagClickHandler as event listener for that link */
	} /* END LOOP: for each link */
}

addClickListenersToTags();

function addClickListenersToTagsSide() {
	const tagLinks = document.querySelectorAll(optTagsListSelector); /* find all links to tags */
	/* START LOOP: for each link */
	for (let tagLink of tagLinks) {
		tagLink.addEventListener('click', tagClickHandler); /* add tagClickHandler as event listener for that link */
	} /* END LOOP: for each link */
}

addClickListenersToTagsSide();

///!!!!!!!!! AUTHORS !!!!!!!!!!!

//Generate Authors

function generateAuthors() {
	let allAuthors = {};
	const articles = document.querySelectorAll(optArticleSelector);

	for (let article of articles) {
		const authorWrapper = article.querySelector(optArticleAuthorSelector);
		let html = '';
		const articleAuthor = article.getAttribute('data-author');
		console.log(articleAuthor);
		const linkHTML = '<li><a href="#author-' + articleAuthor + '">' + articleAuthor + '</a></li>';
		html = html + linkHTML;
		if (!allAuthors.hasOwnProperty(articleAuthor)) {
			allAuthors[articleAuthor] = 1;
		} else {
			allAuthors[articleAuthor]++;
		}
		authorWrapper.innerHTML = html;
	}
	const authorList = document.querySelector('.authors');

	const authorParams = calculateTagsParams(allAuthors);

	let allAuthorsHTML = '';
	for (let author in allAuthors) {
		const authorLinkHTML =
			'<li><a href="#tag-' +
			author +
			'" class="' +
			calculateTagClass(allAuthors[author], authorParams) +
			'">' +
			author +
			' </a></li>';
		allAuthorsHTML += authorLinkHTML;
	}
	authorList.innerHTML = allAuthorsHTML;
}
generateAuthors();

function authorClickHandler(event) {
	event.preventDefault();
	const clickedElement = event.target;
	const href = clickedElement.getAttribute('href');
	const article = href.replace('#tag-', '');

	const activeArticles = document.querySelectorAll('a.active[href^="#tag-"]');

	for (let activeArticle of activeArticles) {
		activeArticle.classList.remove('active');
	}

	const authorLinks = document.querySelectorAll('a[href="' + href + '"]');

	for (let authorLink of authorLinks) {
		authorLink.classList.add('active');
	}

	generateTitleLinks('[data-author="' + article + '"]');
}

function addClickListenersToAuthors() {
	const articleLinks = document.querySelectorAll(optArticleAuthorSelector);

	for (let articleLink of articleLinks) {
		articleLink.addEventListener('click', authorClickHandler);
	}
}

addClickListenersToAuthors();

function addClickListenersToAuthorsSide() {
	const articleLinks = document.querySelectorAll(optAuthorsListSelector);

	for (let articleLink of articleLinks) {
		articleLink.addEventListener('click', authorClickHandler);
	}
}

addClickListenersToAuthorsSide();
