numbers = input("Enter a list of numbers: ")
marks = numbers.split(",")
valid_marks = []
cnt = 0

for item in marks:
    try:
        mark = float(item.strip())
        if 0<=mark<=100:
            valid_marks.append(mark)
            if mark>=50:
                cnt+=1

    except (ValueError, TypeError):
        continue

total_valid = len(valid_marks)
if total_valid==0:
    print("No valid marks.")
else:   
    avg = sum(valid_marks)/total_valid
    highest = max(valid_marks)
    lowest = min(valid_marks)
    pass_rate = (cnt/total_valid)*100

    print("Total valid marks: ", total_valid)
    print("Average mark: ", round(avg, 2))
    print("Highest mark: ", highest)
    print("Lowest mark: ", lowest)
    print("Pass rate: ", round(pass_rate, 1), "%")
