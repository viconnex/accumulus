import math


WORDEMBEDDER = None
T = 1/12


def init_wordembedder(
        fname="resources/cc.fr.300.vec",
        binary=False,
        limit=100000):
    global WORDEMBEDDER
    from gensim.models import KeyedVectors
    print("Loading word2Vec from fname: %s" % fname)
    WORDEMBEDDER = KeyedVectors.load_word2vec_format(
        fname,
        binary=binary,
        limit=limit)


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


def compute_location(similarity1, similarity2):
    diffsim = similarity2 - similarity1
    return sigmoid(diffsim/T)


def compute_similarity_word_listchords(word, list_chords):
    for chords in list_chords:
        chords["leftSim"] = similarity(word, chords["leftNote"])
        chords["rightSim"] = similarity(word, chords["rightNote"])
        chords["note"] = compute_location(
            chords["leftSim"],
            chords["rightSim"])
    return list_chords


def get_parser():
    import argparse
    parser = argparse.ArgumentParser(description="Do something.")
    parser.add_argument('--fname', type=str, default="../resources/cc.fr.300.vec")
    parser.add_argument('--limit', type=float, default=100000)
    parser.add_argument('--binary', action="store_true", default=False)
    return parser


def main():
    parser = get_parser()
    args = parser.parse_args()

    init_wordembedder(
        fname=args.fname,
        binary=args.binary,
        limit=args.limit)

    list_chords = [
        {"leftNote": "méchant",
         "rightNote": "gentil"},
        {"leftNote": "froid",
         "rightNote": "chaud"},
        {"leftNote": "avare",
         "rightNote": "généreux"}
    ]
    words = ["papa",
             "diable",
             "maison",
             "argent",
             "chaise",
             "table",
             "capitalisme",
             "capitalise"]
    for word in words:
        try:
            compute_similarity_word_listchords(word, list_chords)
            print("list_chords: %s for word: %s" % (list_chords,word))
        except:
            print(word)
    # papamostsimilar = WORDEMBEDDER.most_similar("papa")
    # print("papamostsimilar: %s" % str(papamostsimilar))
    hommemostsimilar = WORDEMBEDDER.most_similar(
        positive=["londres", "france"],
        negative=["paris"])
    print("hommemostsimilar: %s" % hommemostsimilar)


if __name__ == "__main__":
    main()
