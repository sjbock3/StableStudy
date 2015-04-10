/**
 * Created by Brendan on 4/2/2015.
 */

/* gettext library */

var catalog = new Array();

function pluralidx(count) { return (count == 1) ? 0 : 1; }
catalog[' and one half'] = ' and one half';
catalog['Log in'] = 'Log in';
catalog['Password'] = 'Password';
catalog['Username'] = 'Username';
catalog['alcove'] = 'Alcove';
catalog['average'] = 'It\u2019s ok';
catalog['building'] = 'In building';
catalog['cafe'] = 'Caf\u00e9';
catalog['classroom'] = 'Conference/<wbr><a class=wbr></a>classroom';
catalog['computer_lab'] = 'Computer lab';
catalog['excellent'] = 'I love it';
catalog['favorite'] = 'Favorite';
catalog['favorited'] = 'Favorited';
catalog['favorites'] = 'Favorites';
catalog['filters'] = 'Filters';
catalog['good'] = 'I like it';
catalog['greeting'] = 'Hi,';
catalog['login'] = 'Log in';
catalog['logout'] = 'Log out';
catalog['loud'] = 'Rowdy';
catalog['lounge'] = 'Lounge';
catalog['moderate'] = 'Chatter';
catalog['neighboring'] = 'In neighboring building';
catalog['open'] = 'Open space';
catalog['outdoor'] = 'Outdoor area';
catalog['poor'] = 'I dislike it';
catalog['quiet'] = 'Low hum';
catalog['review_placeholder'] = 'Review is required. Please explain your star rating.';
catalog['salutation'] = 'Hello.';
catalog['share'] = 'Share';
catalog['showing'] = 'Showing';
catalog['silent'] = 'Silent';
catalog['space'] = 'In space';
catalog['spaces'] = 'spaces';
catalog['studio'] = 'Production studio';
catalog['study_area'] = 'Study area';
catalog['study_room'] = 'Study room';
catalog['terrible'] = 'I won\u2019t be back';
catalog['variable'] = 'Variable';
catalog['write_review'] = 'Write Review';
catalog['write_review_for'] = 'Click to write a review for ';


function gettext(msgid) {
    var value = catalog[msgid];
    if (typeof(value) == 'undefined') {
        return msgid;
    } else {
        return (typeof(value) == 'string') ? value : value[0];
    }
}

function ngettext(singular, plural, count) {
    value = catalog[singular];
    if (typeof(value) == 'undefined') {
        return (count == 1) ? singular : plural;
    } else {
        return value[pluralidx(count)];
    }
}

function gettext_noop(msgid) { return msgid; }

function pgettext(context, msgid) {
    var value = gettext(context + '' + msgid);
    if (value.indexOf('') != -1) {
        value = msgid;
    }
    return value;
}

function npgettext(context, singular, plural, count) {
    var value = ngettext(context + '' + singular, context + '' + plural, count);
    if (value.indexOf('') != -1) {
        value = ngettext(singular, plural, count);
    }
    return value;
}

function interpolate(fmt, obj, named) {
    if (named) {
        return fmt.replace(/%\(\w+\)s/g, function(match){return String(obj[match.slice(2,-2)])});
    } else {
        return fmt.replace(/%s/g, function(match){return String(obj.shift())});
    }
}

/* formatting library */

var formats = new Array();

formats['DATETIME_FORMAT'] = 'N j, Y, P';
formats['DATE_FORMAT'] = 'N j, Y';
formats['DECIMAL_SEPARATOR'] = '.';
formats['MONTH_DAY_FORMAT'] = 'F j';
formats['NUMBER_GROUPING'] = '3';
formats['TIME_FORMAT'] = 'P';
formats['FIRST_DAY_OF_WEEK'] = '0';
formats['TIME_INPUT_FORMATS'] = ['%H:%M:%S', '%H:%M'];
formats['THOUSAND_SEPARATOR'] = ',';
formats['DATE_INPUT_FORMATS'] = ['%Y-%m-%d', '%m/%d/%Y', '%m/%d/%y'];
formats['YEAR_MONTH_FORMAT'] = 'F Y';
formats['SHORT_DATE_FORMAT'] = 'm/d/Y';
formats['SHORT_DATETIME_FORMAT'] = 'm/d/Y P';
formats['DATETIME_INPUT_FORMATS'] = ['%Y-%m-%d %H:%M:%S', '%Y-%m-%d %H:%M', '%Y-%m-%d', '%m/%d/%Y %H:%M:%S', '%m/%d/%Y %H:%M', '%m/%d/%Y', '%m/%d/%y %H:%M:%S', '%m/%d/%y %H:%M', '%m/%d/%y'];

function get_format(format_type) {
    var value = formats[format_type];
    if (typeof(value) == 'undefined') {
        return msgid;
    } else {
        return value;
    }
}
