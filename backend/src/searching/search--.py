import json
import numpy
from itertools import groupby

from backend.src.searching.eddie import MIN_DIST

# Opening JSON file
f = open('./data.json')
  
# returns JSON object as 
# a dictionary
data = json.load(f)
  

#levenstein's algo
#gets distance value between 2 words
def levenshtein_dist(tok1, tok2):
    distances = numpy.zeros((len(tok1) + 1, len(tok2) + 1))

    #puts both words to lowercase for comparison
    #so results arent case sensitive
    token1 = tok1.lower()
    token2 = tok2.lower()

    for t1 in range(len(token1) + 1):
        distances[t1][0] = t1

    for t2 in range(len(token2) + 1):
        distances[0][t2] = t2
        
    a = 0
    b = 0
    c = 0
    
    for t1 in range(1, len(token1) + 1):
        for t2 in range(1, len(token2) + 1):
            if (token1[t1-1] == token2[t2-1]):
                distances[t1][t2] = distances[t1 - 1][t2 - 1]
            else:
                a = distances[t1][t2 - 1]
                b = distances[t1 - 1][t2]
                c = distances[t1 - 1][t2 - 1]
                
                if (a <= b and a <= c):
                    distances[t1][t2] = a + 1
                elif (b <= a and b <= c):
                    distances[t1][t2] = b + 1
                else:
                    distances[t1][t2] = c + 1

    return distances[len(token1)][len(token2)]


#@param search_word: word we want to find
#@param words: string of words we want to search in
#@returns the best matched word in the string we search
def word_match(search_word, words):
    #to store result
    res = []
    #removes punctuation in the words for more accurate comparison
    for i in words.split():
        i = i.replace("!", "")
        i = i.replace("?", "")
        i = i.replace('"', "")
        #get distance between search word and all words
        dist = levenshtein_dist(search_word, i)
        #appends (distance, found word)
        res.append((dist, i))
    #sort on word distance
    res.sort()
    #get best match, ie word will smallest dist to search word
    res = best_match(res)
    return res

#gets best word match and dist from single artifact
#@param results: list of tuples (distance, word)
def best_match(results):
    if len(results) == 0:
        return 0
    else:
        return results[0]


#searches for words in all the artifacts
#@param search_words: string of multiple words
#@param artifacts: data with id and text data to search
#@returns a dictionary per artifact id of value {'id', 'dist', 'word', 'search', 'item'}
# where id is artifact id, dist is dist between search term and best word,
# word is the best found word, search is the corresponding search word
def search_func_all_res(search_words, data, id_col, data_col):
    #initialise list to store all id params
    param_list = []
    #enter the place we want to analyse the text
    for item in data:
        #go through each search word
        for search_word in search_words.split():
            #stores the best machtes in artifact for all the search words
            matches = []
            #get best search word result in artifact
            result = word_match(search_word, item[data_col])
            #make sure words are below min letter diff distance
            if len(result) != 0 and result[0] <= minDist:
                if len(matches) == 0:
                    matches.append(item[id_col])
                matches.append(result)
                matches.append(search_word)
                matches.append(item)
            if len(matches) != 0:
                param_list.append(matches)
    #sort to 
    param_list.sort()
    dictionary = dickify(param_list)
    return dictionary
            
# define a fuction for key
def key_func(k):
    return k['id']

#make into a guud dictionary
def dickify(param_list):
    new_list = []
    for i in param_list:
        art_id = i[0]
        art_dist = i[1][0]
        art_word = i[1][1]
        search_word = i[2]
        item = i[3]
        new_list.append({'id':art_id,'dist':art_dist,'word':art_word, 'search':search_word, 'item': item})

    # sort INFO data by 'company' key.
    new_list = sorted(new_list, key=key_func)
    final = {}
  
    for key, value in groupby(new_list, key_func):
        listy = list(value)
        final[key] = listy

    return final


def best_search_results(all_search_results, word_count):
    res = []
    for result in all_search_results:
        
        if len(all_search_results[result]) == word_count:
            #print("heyoooooo")
            stats = {}
            stats['id'] = result
            stats['match_count'] = len(all_search_results[result])
            tot_dist = 0
            found_words = []
            it = {}
            for word in all_search_results[result]:
                tot_dist += word['dist']
                found_words.append(word['word'])
                if len(it) == 0:
                    it = word['item']
            stats['tot_dist'] = tot_dist
            stats['best_words'] = found_words
            stats['item'] = it
            res.append(stats)
        #print("here ", res)
    sorted_res = sorted(res, key=lambda d: d['tot_dist'])
    return sorted_res
    
        
MIN_DIST = 4
search_words = "honey bitch"
search_word_count = len(search_words.split())

results = search_func_all_res(search_words, data['movie'], 'id', 'data')
final = best_search_results(results, search_word_count)
print(final)

  
# Closing file
f.close()