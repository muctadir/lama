import numpy
from itertools import groupby


#levenstein's algo
#gets distance value between 2 words
#@param tok1, tok2: two string words
#@returns letter distance between both words
def levenshtein_dist(tok1, tok2):
    distances = numpy.zeros((len(tok1) + 1, len(tok2) + 1))

    #puts both words to lowercase for comparison
    #so results arent case sensitive
    token1 = tok1.lower()
    token2 = tok2.lower()

    #initialise distance matrix
    for t1 in range(len(token1) + 1):
        distances[t1][0] = t1

    for t2 in range(len(token2) + 1):
        distances[0][t2] = t2
        
    a = 0
    b = 0
    c = 0
    
    #filling in distance matrix
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

    #get final distance between words
    return distances[len(token1)][len(token2)]


#@param search_word: word we want to find
#@param words: string of words we want to search in
#@returns the best matched word in the string we search
def word_match(search_word, words):
    #to store result
    result = []
    #removes punctuation in the words for more accurate comparison
    for i in words.split():
        i = i.replace("!", "")
        i = i.replace("?", "")
        i = i.replace('"', "")
        #get distance between search word and all words
        dist = levenshtein_dist(search_word, i)
        #appends (distance, found word)
        result.append((dist, i))
    #sort on word distance
    result.sort()
    #get best match, ie word will smallest dist to search word
    result = best_match(result)
    return result

#gets best word match and dist from single artifact
#@param results: list of tuples (distance, word)
def best_match(results):
    if len(results) == 0:
        return 0
    else:
        return results[0]

"""
Searches for words in data
@param search_words: string of multiple words
@param data: a list of dictionaries to search through
@param id_col: the name of the column containing the id
@param data_cols: the columns to search through
@returns a dictionary per item id of value {'id', 'dist', 'word', 'search', 'item'}
where id is item id, dist is dist between search term and best word,
word is the best found word, search is the corresponding search word,
item is a dictionary of id and data
"""
def search_func_all_res(search_words, data, id_col, data_cols):
    # Initialise list to store all id params
    param_list = []
    # Enter the place we want to analyse the text
    for item in data:
        # Go through each search word
        for search_word in search_words.split():
            # Search through all the data columns
            # Extract the data into a list
            search_data = [str(item[data_col]) for data_col in data_cols]
            # Concatenate the data into one string to search through
            joined_data = " ".join(search_data)
            # Get best search word result in artifact
            result = word_match(search_word, joined_data)
            # Make sure words are below min letter diff distance
            if len(result) != 0 and result[0] <= MIN_DIST:
                matches = [
                    item[id_col],
                    result,
                    search_word,
                    item
                ]
                param_list.append(matches)
    # Turn into a dictionary that is grouped by id
    dictionary = list_to_dictionary(param_list, id_col)
    return dictionary
            

# Groups the param list into a dictionary by ID
# @param the list of arrays of type [id, [dist, word], search_word, item]
# there is an entry in the list for each best word of the search words in each artifact
def list_to_dictionary(param_list, id_col):
    # define a fuction for key
    def key_func(k):
        return k[id_col]
    new_list = []
    for i in param_list:
        #gets all paramlist elements
        i_id = i[0]
        i_dist = i[1][0]
        i_word = i[1][1]
        search_word = i[2]
        item = i[3]
        #initalise keys and values
        new_list.append({'id':i_id,'dist':i_dist,'word':i_word, 'search':search_word, 'item': item})
    # sort new_list data by id key.
    new_list = sorted(new_list, key=key_func)
    #store the grouped data
    final = {}
    #grouping by key (set to ID)
    for key, value in groupby(new_list, key_func):
        listy = list(value)
        final[key] = listy

    return final

#takes the big dictionary of results per artifact and
#  gets the best search results by min total word distance
#@param list of the return type of search_func_all_res()
#returns list of items of form [{},{},{id:, match_count:, tot_dist:, best_words:[], item:{}},{}]
def best_search_results(all_search_results, word_count):
    #to store all results
    sorted_result = []
    #goes through all items in the dict 
    for result in all_search_results:
        #checks if there is a good result for each word
        if len(all_search_results[result]) == word_count:
            #to store info per result as dictionnary
            stats = {}
            stats['id'] = result
            stats['match_count'] = len(all_search_results[result])
            #initialise total distance
            tot_dist = 0
            #initiliase list of all the best word matches
            found_words = []
            #intialise dictionary for the item
            it = None
            #goes through all values of the dictionary at certain key
            for word in all_search_results[result]:
                #gets total word distance
                tot_dist += word['dist']
                #adds corresponding best words to list
                found_words.append(word['word'])
                #adds item data once
                if not it:
                    it = word['item']
            #add all set up variables to the dictionary
            stats['tot_dist'] = tot_dist
            stats['best_words'] = found_words
            stats['item'] = it
            #appends result info to list
            sorted_result.append(stats)
    #sort on total word distance for best result
    sorted_result = sorted(sorted_result, key=lambda d: d['tot_dist'])
    return sorted_result
    
        
MIN_DIST = 3
