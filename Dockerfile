FROM iron/go

ADD badger badger

ENTRYPOINT ["./badger"]