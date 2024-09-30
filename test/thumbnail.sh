COUNTER=1
for file in *.JPG; 
do 
    mv "${file}" "$COUNTER.JPG";
    COUNTER=$((COUNTER+1));
done

mkdir thumbnails;

for i in *.JPG; 
do 
    convert $i -thumbnail 300 thumbnails/$i; 
done