/**
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

quotes = [
    "It is better to keep your mouth closed and let people think you are a fool than to open it and remove all doubt. \n- Mark Twain",
    "We know what we are, but know not what we may be. \n- William Shakespeare",
    "Physics is the universe’s operating system. \n- Steven R Garman",
    "It’s hardware that makes a machine fast.  It’s software that makes a fast machine slow. \n- Craig Bruce",
    "The greatest enemy of knowledge is not ignorance, it is the illusion of knowledge. \n- Stephen Hawking",
    "The more you know, the more you realize you know nothing. \n- Socrates",
    "Tell me and I forget.  Teach me and I remember.  Involve me and I learn. \n-  Benjamin Franklin",
	"Real knowledge is to know the extent of one’s ignorance. \n- Confucius",
	"If people never did silly things, nothing intelligent would ever get done. \n- Ludwig Wittgenstein",
	"Getting information off the Internet is like taking a drink from a fire hydrant.”– Mitchell Kapor",
	"If you think your users are idiots, only idiots will use it.”– Linus Torvalds",
	"From a programmer’s point of view, the user is a peripheral that types when you issue a read request. \n- P. Williams",
	"Where is the ‘any’ key? \n- Homer Simpson, in response to the message, 'Press any key'",
	"Computers are good at following instructions, but not at reading your mind. \n- Donald Knuth",
	"There is only one problem with common sense; it’s not very common. \n- Milt Bryce",
	"Your most unhappy customers are your greatest source of learning. \n- Bill Gates",
	"The Internet?  We are not interested in it. \n- Bill Gates, 1993"
];

var developerEmail = context.getVariable("developer.email");

if (developerEmail) {
    context.setVariable("response.header.x-developer", developerEmail);
} else {
    quotes = quotes.slice(0,2);
}

var response = { value: quotes[Math.floor((Math.random()*quotes.length))] };

context.setVariable("response.content", JSON.stringify(response));
