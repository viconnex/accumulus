import math
import random
try:
    import wrapper_gensim
except:
    from nlp import wrapper_gensim

WORDEMBEDDER = None


def init_wordembedder(
        fname="resources/cc.fr.300.vec",
        limit=100000):
    global WORDEMBEDDER
    from gensim.models.keyedvectors import KeyedVectors
    binary = fname.endswith(".bin")
    print("Loading word2Vec from fname: %s" % fname)
    WORDEMBEDDER = wrapper_gensim._load_word2vec_format(
        KeyedVectors,
        fname=fname,
        binary=binary,
        limit=limit)
    # WORDEMBEDDER = KeyedVectors.load_word2vec_format(
    #     fname=fname,
    #     binary=binary,
    #     limit=limit)
    return WORDEMBEDDER


def load_list_chords(chordsname, nb_chords=4, shuffle=True):
    list_chords = []
    with open(chordsname, "r") as reader:
        for line in reader:
            line = line.strip().lower()
            chord = {
                "leftNote": line.split(",")[0],
                "rightNote": line.split(",")[1]
                }
            if WORDEMBEDDER is not None:
                if chord["leftNote"] not in WORDEMBEDDER:
                    print("leftnote: %s not in vocab" % chord["leftNote"])
                    continue
                if chord["rightNote"] not in WORDEMBEDDER:
                    print("rightnote: %s not in vocab" % chord["rightNote"])
                    continue
            list_chords.append(chord)
    if shuffle:
        random.shuffle(list_chords)
    if nb_chords:
        list_chords = list_chords[:nb_chords]
    return list_chords


def similarity(word1, word2):
    """todo"""
    global WORDEMBEDDER
    if WORDEMBEDDER is None:
        init_wordembedder()

    if word1 not in WORDEMBEDDER:
        return 0
    if word2 not in WORDEMBEDDER:
        return 0
    return WORDEMBEDDER.similarity(word1, word2)


def sigmoid(x):
    return 1 / (1 + math.exp(-x))


def compute_location(similarity1, similarity2, temperature=1/12):
    diffsim = similarity2 - similarity1
    return sigmoid(diffsim/temperature)


def compute_similarity_word_listchords(word, list_chords, temperature=1/12):
    word = word.lower()
    for chords in list_chords:
        chords["leftSim"] = similarity(word, chords["leftNote"])
        chords["rightSim"] = similarity(word, chords["rightNote"])
        chords["note"] = compute_location(
            chords["leftSim"],
            chords["rightSim"],
            temperature=temperature)
    return list_chords


def get_parser():
    import argparse
    parser = argparse.ArgumentParser(description="Do something.")
    parser.add_argument('--lang', type=str, default="fr")
    parser.add_argument('--limit', type=float, default=1000000)
    return parser


def main():
    parser = get_parser()
    args = parser.parse_args()

    if args.lang == "fr":
        fname = "../resources/cc.fr.300.vec"
        chordsname = "../resources/chords/french.csv"
        words = ["papa",
                 "diable",
                 "maison",
                 "argent",
                 "chaise",
                 "table",
                 "capitalisme"]
        positive = ["londres", "france"]
        negative = ["paris"]
        temperature = 1/12
    else:
        fname = "../resources/wiki_en_dLCE_100d_minFreq_100.bin"
        chordsname = "../resources/chords/english.csv"
        words = ["dad",
                 "evil",
                 "house",
                 "silver",
                 "chair",
                 "table",
                 "capitalism"]
        positive = ["london", "france"]
        negative = ["paris"]
        temperature = 1

    init_wordembedder(
        fname=fname,
        limit=args.limit)

    list_chords = load_list_chords(chordsname, nb_chords=4, shuffle=True)

    for word in words:
        compute_similarity_word_listchords(
            word, list_chords,
            temperature=temperature)
        print("list_chords: %s for word: %s" % (list_chords, word))

    posneg = WORDEMBEDDER.most_similar(
        positive=positive,
        negative=negative)
    print("posneg: %s positive: %s negative: %s" % (
        posneg,
        positive,
        negative))


if __name__ == "__main__":
    main()
