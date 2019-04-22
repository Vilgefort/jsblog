'use strict';
/* global Handlebars */
const opts = {
	articleSelector: '.post',
	titleSelector: '.post-title',
	titleListSelector: '.titles',
	articleTagsSelector: '.post-tags .list',
	articleAuthorSelector: '.post .post-author',
	tagsListSelector: '.sidebar .tags',
	authorsListSelector: '.sidebar .authors',
	cloudClassCount: 5,
	cloudClassPrefix: 'tag-size-',
};

const templates = {
	articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
	tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
	authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
	tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
	authorCloudLink: Handlebars.compile(document.querySelector('#template-author-cloud-link').innerHTML),
};

//Title Click Handler
function titleClickHandler(event) {
	const activeLinks = document.querySelectorAll('.titles a.active');

	for (let activeLink of activeLinks) {
		activeLink.classList.remove('active');
	}

	event.preventDefault();
	const clickedElement = this;
	clickedElement.classList.add('active');
	const activeArticles = document.querySelectorAll('.posts .post');

	for (let activeArticle of activeArticles) {
		activeArticle.classList.remove('active');
	}

	const articleSelector = clickedElement.getAttribute('href');

	const targetArticle = document.querySelector(articleSelector);
	targetArticle.classList.add('active');
}

//Generate Title Links

function generateTitleLinks(customSelector = '') {
	const titleList = document.querySelector(opts.titleListSelector);
	titleList.innerHTML = '';

	const articles = document.querySelectorAll(opts.articleSelector + customSelector);

	let html = '';

	for (let article of articles) {
		const articleId = article.getAttribute('id');

		const articleTitle = article.querySelector(opts.titleSelector).innerHTML;

		const linkHTMLData = { id: articleId, title: articleTitle };
		const linkHTML = templates.articleLink(linkHTMLData);
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
	const classNumber = Math.floor(percentage * (opts.cloudClassCount - 1) + 1);

	return opts.cloudClassPrefix + classNumber;
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
	let allTags = {};
	const articles = document.querySelectorAll(opts.articleSelector);

	for (let article of articles) {
		const tagWrapper = article.querySelector(opts.articleTagsSelector);
		let html = '';
		const articleTags = article.getAttribute('data-tags');
		const articleTagsArray = articleTags.split(' ');

		for (let tag of articleTagsArray) {
			const linkHTMLData = { id: tag, tagName: tag };
			const linkHTML = templates.tagLink(linkHTMLData);
			html = html + linkHTML;
			console.log(html);
			if (!allTags.hasOwnProperty(tag)) {
				allTags[tag] = 1;
			} else {
				allTags[tag]++;
			}
		}

		tagWrapper.innerHTML = html;
	}

	const tagList = document.querySelector('.tags');

	const tagsParams = calculateTagsParams(allTags);

	const allTagsData = { tags: [] };
	for (let tag in allTags) {
		allTagsData.tags.push({
			tag: tag,
			count: allTags[tag],
			className: calculateTagClass(allTags[tag], tagsParams),
		});
	}
	tagList.innerHTML = templates.tagCloudLink(allTagsData);
	console.log('tu' + allTagsData);
}

generateTags();

function tagClickHandler(event) {
	event.preventDefault();
	const clickedElement = event.target;
	console.log(clickedElement);

	const href = clickedElement.getAttribute('href');
	console.log('HREF: ', href);

	const tag = href.replace('#tag-', '');

	const activeTags = document.querySelectorAll('a.active[href^="#tag-"]');

	for (let activeTag of activeTags) {
		activeTag.classList.remove('active');
	}

	const tagLinks = document.querySelectorAll('a[href="' + href + '"]');

	for (let tagLink of tagLinks) {
		tagLink.classList.add('active');
	}

	generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags() {
	const tagLinks = document.querySelectorAll(opts.articleTagsSelector);
	for (let tagLink of tagLinks) {
		tagLink.addEventListener('click', tagClickHandler);
	}
}

addClickListenersToTags();

function addClickListenersToTagsSide() {
	const tagLinks = document.querySelectorAll(opts.tagsListSelector);

	for (let tagLink of tagLinks) {
		tagLink.addEventListener('click', tagClickHandler);
	}
}

addClickListenersToTagsSide();

///!!!!!!!!! AUTHORS !!!!!!!!!!!

//Generate Authors

function generateAuthors() {
	let allAuthors = {};
	const articles = document.querySelectorAll(opts.articleSelector);

	for (let article of articles) {
		const authorWrapper = article.querySelector(opts.articleAuthorSelector);
		let html = '';
		const articleAuthor = article.getAttribute('data-author');
		const linkHTMLData = { id: articleAuthor, author: articleAuthor };
		const linkHTML = templates.authorLink(linkHTMLData);
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

	const allAuthorsData = { author: [] };
	for (let author in allAuthors) {
		allAuthorsData.author.push({
			author: author,
			count: allAuthors[author],
			className: calculateTagClass(allAuthors[author], authorParams),
		});
	}

	authorList.innerHTML = templates.authorCloudLink(allAuthorsData);
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
	const articleLinks = document.querySelectorAll(opts.articleAuthorSelector);

	for (let articleLink of articleLinks) {
		articleLink.addEventListener('click', authorClickHandler);
	}
}

addClickListenersToAuthors();

function addClickListenersToAuthorsSide() {
	const articleLinks = document.querySelectorAll(opts.authorsListSelector);
	for (let articleLink of articleLinks) {
		articleLink.addEventListener('click', authorClickHandler);
	}
}

addClickListenersToAuthorsSide();
